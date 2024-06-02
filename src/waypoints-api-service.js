import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class WaypointsApiService extends ApiService {
  get waypoints() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  async createWaypoint(waypoint) {
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(waypoint),
    });

    return await ApiService.parseResponse(response);
  }

  async updateWaypoint(waypoint) {
    const response = await this._load({
      url: `waypoints/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(waypoint),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  async deleteWaypoint(waypoint) {
    await this._load({
      url: `waypoints/${waypoint.id}`,
      method: Method.DELETE,
    });
  }
}