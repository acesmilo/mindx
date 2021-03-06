import { TopicData } from 'xmind-model/types/models/topic';
import { createStore } from 'relax-ts';
import produce from 'immer';
import {
  getLeftNode,
  HierachyNodeWithTopicData,
  getRighttNode,
  getTopNode,
  getBottomNode,
} from '../utils/tree';
import { EDITOR_MODE } from '../constant';

type IState = {
  mode: EDITOR_MODE;
  selectedNodeId: string;
  scale: number;
  dragingNode: TopicData | null;
  readonly: boolean;
  translate: [number, number];
};

export const initialState: IState = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  scale: 1,
  dragingNode: null,
  readonly: false,
  translate: [0, 0],
};

const store = createStore({
  state: initialState,
  reducers: {
    SET_MODE(state, payload: EDITOR_MODE) {
      if (state.readonly) return;
      state.mode = payload;
    },
    SELECT_NODE(state, payload: string) {
      state.selectedNodeId = payload;
    },
    DRAG_NODE(state, payload: TopicData | null) {
      // remove TopicData's depth、side
      const dragingNode = produce(payload, draft => {
        delete draft?.side;
        delete draft?.depth;
      });
      state.dragingNode = dragingNode;
    },
    SET_SCALE(state, payload: number) {
      state.scale = payload;
    },
    SET_TRANSLATE(state, payload: [number, number]) {
      state.translate = payload;
    },
    MOVE_LEFT(state, rootWithCoords: HierachyNodeWithTopicData) {
      const target = getLeftNode(rootWithCoords, state.selectedNodeId);
      if (target) {
        state.selectedNodeId = target.data.id;
      }
    },
    MOVE_RIGHT(state, rootWithCoords: HierachyNodeWithTopicData) {
      const target = getRighttNode(rootWithCoords, state.selectedNodeId);
      if (target) {
        state.selectedNodeId = target.data.id;
      }
    },
    MOVE_TOP(state, rootWithCoords: HierachyNodeWithTopicData) {
      const target = getTopNode(rootWithCoords, state.selectedNodeId);
      if (target) {
        state.selectedNodeId = target.data.id;
      }
    },
    MOVE_DOWN(state, rootWithCoords: HierachyNodeWithTopicData) {
      const target = getBottomNode(rootWithCoords, state.selectedNodeId);
      if (target) {
        state.selectedNodeId = target.data.id;
      }
    },
  },
  effects: {},
});

export default store;
