import { mocks } from "./test-utils";

globalThis.Audio = jest.fn().mockImplementation(() => ({
  pause: mocks.Audio.pause,
  play: mocks.Audio.play,
}));
