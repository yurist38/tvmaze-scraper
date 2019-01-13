import Actor from './models/actor.model';

export function sortByBirthdayDesc(items: Actor[]): Actor[] {
  return items.sort((a, b) => {
    // TODO: double check the logic in case of undefined date
    if (!a.birthday || !b.birthday) {
      return 1;
    }

    return new Date(a.birthday) < new Date(b.birthday) ? 1 : -1;
  });
}

export function formatActors(actors: Array<{ person: any }>): Actor[] {
  const addedActorIds: number[] = [];
  return actors.reduce((acc: Actor[], c: { person: any}) => {
    const { id, birthday, name } = c.person || {} as Actor;

    // If we don't receive id or/and name of an actor let's don't store the actor
    if (!id || !name) {
      return acc;
    }

    // Sometimes we have duplicating actors, let's filter them out
    if (!addedActorIds.includes(id)) {
      acc.push({
        actorId: id,
        birthday,
        name,
      });
      addedActorIds.push(id);
    }
    return acc;
  }, []);
}
