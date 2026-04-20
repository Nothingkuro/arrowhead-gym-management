export interface Observer<TEvent> {
  update(event: TEvent): Promise<void> | void;
}

export class Subject<TEvent> {
  private observers = new Set<Observer<TEvent>>();

  subscribe(observer: Observer<TEvent>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<TEvent>): void {
    this.observers.delete(observer);
  }

  async notify(event: TEvent): Promise<void> {
    const results = await Promise.allSettled(
      Array.from(this.observers, (observer) => Promise.resolve(observer.update(event))),
    );

    results.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('Observer execution failed:', result.reason);
      }
    });
  }
}
