type SkylightEvent<T = any> = Event & { _data?: T };

export class SkylightEventTarget extends EventTarget {
  prefix: string;

  constructor(prefix: string) {
    super();
    this.prefix = prefix;
  }

  on<T = any>(evt: string, cb: (e?: T) => void) {
    this.addEventListener(this.prefix + evt, (e: SkylightEvent<T>) =>
      cb(e._data)
    );
  }

  emit<T = any>(evt: string, data?: T) {
    const event = new Event(this.prefix + evt) as SkylightEvent<T>;
    event._data = data;
    this.dispatchEvent(event);
  }
}
