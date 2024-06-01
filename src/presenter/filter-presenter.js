import { FilterType, UpdateType } from '../const';
import { filter } from '../utils/filter';
import FiltersView from '../view/filters-view';
import { remove, render, replace } from '../framework/render';

export default class FilterPresenter {
  #filterContainerEl = null;
  #filterModel = null;
  #waypointsModel = null;

  #filterComponent = null;

  constructor({
    filterContainerEl,
    filterModel,
    waypointsModel,
  }) {
    this.#filterContainerEl = filterContainerEl;
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const waypoints = this.#waypointsModel.waypoints;

    return [
      {
        type: FilterType.EVERYTHING,
        hasItems: filter[FilterType.EVERYTHING](waypoints).length,
      },
      {
        type: FilterType.PAST,
        hasItems: filter[FilterType.PAST](waypoints).length,
      },
      {
        type: FilterType.PRESENT,
        hasItems: filter[FilterType.PRESENT](waypoints).length,
      },
      {
        type: FilterType.FUTURE,
        hasItems: filter[FilterType.FUTURE](waypoints).length,
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      activeFilter: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainerEl);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
