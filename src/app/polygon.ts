import { Position } from "./types/position";
import { InteractionState } from "./types/interaction-state";

abstract class Polygon {
  protected _position: Position;
  protected _state: InteractionState;

  constructor() {
    this._state = InteractionState.Drawed;
  }

  abstract setPosition(position: Position): void;
  abstract getCollisionElement(position: Position): boolean;

  setInteractionState(newState: keyof typeof InteractionState) {
    this._state = InteractionState[newState];
  }

  get position() {
    return { ...this._position } as const;
  }

  get hover() {
    return this._state === InteractionState.Hover;
  }

  get select() {
    return this._state === InteractionState.Select;
  }
}

export default Polygon;
