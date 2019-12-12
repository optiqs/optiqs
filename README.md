# optiqs

`optiqs` is a state management library for typescript apps based on [monocle-ts](https://github.com/gcanti/monocle-ts). The library itself is only 350b minified and gzipped. It currently implements a single reducer and action creator, ready to be hooked in a standard redux setup.

# use case (tl;dr)

`optiqs` is an alternative to the Redux approach to state management. Instead of having to write reducers and selectors, (and tests for each of these) you'll leverage different optics abstractions to make each state update or read simple, type-safe and easy to compose. You don't have to be familiar with optics or functional programming in general to use this library. You'll find that writing and composing lenses, traversals is really easy and offer a more obvious approach to state management than standard Redux.

Here's a small snippet showing some of these differences, and how easy it is to work with optics (using redux-saga):

Standard               |  Optiqs
:---------------------:|:-------------------------:
![](docs/standard.png) |![](docs/optics.png)

Note that we don't have to write tests for the reducers or selectors on the second case, because there are no reducers, and no selectors, just lenses.
Another benefit we gained for free here is that we remove all the possible "logic" from our reducers. Some random dev wouldn't even be able to

```typescript
(state, action) =>
    if (state.shouldDoLogicInReducer) ? "no" : "nope"
```

and make your reducer really hard to understand.
Optics also makes you think more generically about your update functions, since they are the only thing you should test. If you plan on updating a collection with a new value, write a generic collection append function, test it once and never again think about writing tests again.

# the long story

If you ever worked on a large application with a RESTful api you must have felt some of the pains of managing relational state in a single page application. Have you ever tried to delete some entity with 3 or 4 references to it in your normalized state?

Let's try to solve this small relationship problem using redux. Say you have some `team` entity, which contains many other `member` entities, your state is also normalized.

```typescript
interface Member {
    id: string
    name: string
    age: number
    teamId: Team['id']
}
interface Team {
    id: string
    name: string
    members: Member['id'][]
}
```

Then you have three pages in your application: a Team page, where you see all member of a team, a Member page where you can manage an individual member, and a Directory page where you can search for members

```typescript
interface TeamPage {
    teamId: Team['id']
    teamName: Team['name']
    teamMembers: Member[]
}
interface MemberPage {
    memberId: Member['id']
    name: Member['name']
}
interface Directory {
    searchTerm: string
    filteredMembers: Member[]
}
```

Now you go to the Member page, and delete a member, so you dispatch an action there:

```typescript
    deleteMember(memberId)
```

That should trigger some worflow to remove a member. In there you make a call to your api, which would return some successful 204 No content response. You can now dispatch an event to everyone saying your delete was successful. Your reducers could do something like this:

```typescript
// members module
const membersReducer = handleActions({
    [deleteMember]: (state, action) => omit(state, action.payload.memberId)
})
// teams module
const teamsReducer = handleActions({
    [deleteMember]: (state, action) => ({
        ...state,
        [action.payload.teamId]: {
            ...team,
            members: omit(team.members, action.payload.memberId)
        }
    }
})
// directory module
const directoryReducer = handleActions({
    [deleteMember]: (state, action) => ({
        filteredMembers: omit(state.filteredMembers, action.payload.memberId)
    })
})
```
But there's something wrong with this approach. The pages would have crashed with some kind of cannot read whatever from undefined error. That's because as soon as `membersReducer` processes that event, our state is in an intermediate, bad shape. The Team page is referencing a member that does not exist anymore, as well as the Directory page. So we go ahead and modify our selectors to check if there's an undefined member there and it looks like we're good to go.

But that's kind of annoying. Now all your selectors have to handle possible undefined things everywhere. You also got that invalid intermediate state with some data that should not exist. Is there a better approach?

Well, we can do something like a relational table, have a module `teamMembers`, and do the processing in that reducer instead, so our selectors would compose from that level and we wouldn't have to always filter undefined things. 

But this one is also a bit awkward, because now you're in a Member page, dispatching an action called `deleteMember` that's not really defined in the member module, but in the teamMembers module. So you could rename that to `removeMemberFromTeam` but is that everything that's really happening? What about the Directory page? In this approach, just as in the above, all the logic for removing a member is scattered across your application. You don't have a single place where you can see what happens to your state when a member is removed. You have to know all the relationships.

So let's ignore syntax for a bit and think about how we would want to solve this in an ideal world. From the solutions above we can see that we want:

- [ ] All the logic is declared in a single workflow (no scattered logic across multiple modules)
- [ ] No intermediate invalid states
- [ ] An obvious source where your action is handled, the consumer does not have to know about relationships

Here's an ideal code snipped of what we want, in pseudo-language:

```
result = callRemoveMemberApi
if result is a success
    update:
        members: remove with memberId
        teams: remove with memberId from team with teamId
        directory: remove with memberId from filtered users
else
    update
        errors: add new error for delete member
```

Let's try to write that using `optiqs`:

```typescript
const result = yield call(api, `remove/${memberId}`)
if (result.isSuccess)
    updateState([
        selectMembers.modify(filter(memberId)))
        selectTeamMembersByTeamId(teamId).modify(filter(memberId)))
        selectDirectoryFilteredUsers.modify(filter(memberId)))
    ])
else
    updateState(
        selectErrors.modify(append(new Error('failed to remove member')))
    )
```

That's not very different from our ideal code snippet, is it? So let's see if we fulfill the requirements for our ideal world:

- [x] All the logic is in a single worflow (in this case our saga).
- [x] The first updateState block does a bulk update to the state, with no intermediate invalid state.
- [x] The action is still called `deleteMember`, and handled by the member module, so you don't have to know about relationships to dispatch an action.

## installation

`npm install @optiqs/optiqs`

## setup

In your store setup, just hook up the reducer provided. It's the only one you'll need.

You can either use the reducer and dispatch an `updateState` action to set the initial state:

```typescript
import {createStore, applyMiddleware} from 'redux'
import {initialState, State} from './state.ts'
import {reducer, OptiqsAction, updateState} from '@optiqs/optiqs'

export const store =
    createStore<State, OptiqsAction<State>, void, void>(
        reducer,
        applyMiddleware(...)
    )

store.dispatch(
  updateState<State>(_ => initialState)
)
```

Or use `createReducer` and pass your initial state:

```typescript
import {createStore, applyMiddleware} from 'redux'
import {initialState, State} from './state.ts'
import {createReducer, OptiqsAction, updateState} from '@optiqs/optiqs'

export const store =
    createStore<State, OptiqsAction<State>, void, void>(
        createReducer(initialState),
        applyMidleware(...)
    )
```

Your side effects layer is now ready to make updates to your state:

```typescript
function* save(action) {
    const result = yield call(api, {data: action.payload})
    if (result.isSuccess)
        yield put(updateState(...))
}
```

## usage

Feel free to look at the example todos app, particularly the following files:

[todo actions](examples/todos/src/actions/todos.ts)

[visibility actions](examples/todos/src/actions/visibilityFilter.ts)

[lenses](examples/todos/src/lenses/index.ts)

#### What arguments do I pass to my update state?

Any lens composed from your state root

```typescript
// in your lenses

const getAuthentication = Lens.fromProp<State>()('authentication')
const getCurrentUser = Lens.fromProp<Authentication>()('currentUser')
const selectCurrentUser = getAuthentication.compose(getCurrentUser)

// in your saga

yield put(updateState(
    selectCurrentUser.set(newValue)
))

// you can also do multiple updates

yield put(updateState([
    selectName.set('New Name'),
    selectEmail.set('new@email.com'),
    selectAge.set(55),
]))
```

## `optics-gen`

The [optics generator](https://github.com/optiqs/optiqs-gen) should be able to generate all lenses from  basic typescript definitions, even across multiple files. It is under active development.

## dependencies

You'll want to get [monocle-ts](https://github.com/gcanti/monocle-ts) and [fp-ts](https://github.com/gcanti/fp-ts).

`optiqs` also extend `monocle-ts` and introduces the concept of [projections](https://github.com/optiqs/projections), which is a peer of this library.

`optiqs` shouldn't actually depend on redux at all, but we do export everything as a reducer and action creator to make use of the great devtools redux has.

## documentation

If you're looking for more information about optics in typescript, the [monocle-ts](https://github.com/gcanti/monocle-ts) website is a good start. More information will be added to the `optiqs` library as needed.

