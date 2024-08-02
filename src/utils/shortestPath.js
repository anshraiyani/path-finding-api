import { Location } from "../models/location.models.js";
import { Road } from "../models/road.models.js";

export const findShortestPath = async (startLocationId, endLocationId) => {
    const startLocation = await Location.findById(startLocationId);
    const endLocation = await Location.findById(endLocationId);

    if (!startLocation || !endLocation) {
        throw new Error("Invalid start or end location");
    }

    const roads = await Road.find()
        .populate("start_location_id")
        .populate("end_location_id");

    // this graph is kind of like an adjacency list
    const graph = {};

    roads.forEach((road) => {
        const startId = road.start_location_id._id.toString();
        const endId = road.end_location_id._id.toString();
        const travelTime = road.calculateTime();

        if (!graph[startId]) {
            graph[startId] = {};
        }
        if (!graph[endId]) {
            graph[endId] = {};
        }

        graph[startId][endId] = travelTime;
        graph[endId][startId] = travelTime;
    });

    console.log(graph);

    return dijkstra(
        graph,
        startLocationId.toString(),
        endLocationId.toString()
    );
};

const dijkstra = (graph, startNode, endNode) => {
    const times = {};
    const backtrace = {};
    const pq = new PriorityQueue();

    for (let node in graph) {
        times[node] = Infinity;
    }
    times[startNode] = 0;

    pq.enqueue([startNode, 0]);

    while (!pq.isEmpty()) {
        const shortestStep = pq.dequeue();
        const currentNode = shortestStep[0];

        for (let neighbor in graph[currentNode]) {
            const time = times[currentNode] + graph[currentNode][neighbor];

            if (time < times[neighbor]) {
                times[neighbor] = time;
                backtrace[neighbor] = currentNode;
                pq.enqueue([neighbor, time]);
            }
        }
    }

    const path = [endNode];
    let lastStep = endNode;
    while (lastStep !== startNode) {
        path.unshift(backtrace[lastStep]);
        lastStep = backtrace[lastStep];
    }

    return path;
};

class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element) {
        if (this.isEmpty()) {
            this.collection.push(element);
        } else {
            let contain = false;
            for (let i = 0; i < this.collection.length; i++) {
                if (element[1] < this.collection[i][1]) {
                    this.collection.splice(i, 0, element);
                    contain = true;
                    break;
                }
            }
            if (!contain) {
                this.collection.push(element);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}
