import { observable, computed, action } from 'mobx';

export default class State {
  @observable
  work = [];
  @action.bound
  updateWork(i, value) {
    this.work[i] = value;
  }
}
