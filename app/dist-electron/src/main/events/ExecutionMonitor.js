import { EventEmitter } from 'events';
export class ExecutionMonitor extends EventEmitter {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!ExecutionMonitor.instance) {
            ExecutionMonitor.instance = new ExecutionMonitor();
        }
        return ExecutionMonitor.instance;
    }
    emitTaskStarted(task) {
        this.emit('taskStarted', task);
    }
    emitTaskUpdated(task, currentStep) {
        this.emit('taskUpdated', { task, currentStep });
    }
    emitTaskCompleted(task) {
        this.emit('taskCompleted', task);
    }
    emitTaskFailed(task, error) {
        this.emit('taskFailed', { task, error });
    }
}
