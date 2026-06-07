import { EventEmitter } from 'events';
import { Task, Execution, Plan, PlanStep } from '../types/index.js';

export class ExecutionMonitor extends EventEmitter {
  private static instance: ExecutionMonitor;

  private constructor() {
    super();
  }

  public static getInstance(): ExecutionMonitor {
    if (!ExecutionMonitor.instance) {
      ExecutionMonitor.instance = new ExecutionMonitor();
    }
    return ExecutionMonitor.instance;
  }

  public emitTaskStarted(task: Task) {
    this.emit('taskStarted', task);
  }

  public emitTaskUpdated(task: Task, currentStep?: PlanStep) {
    this.emit('taskUpdated', { task, currentStep });
  }

  public emitTaskCompleted(task: Task) {
    this.emit('taskCompleted', task);
  }

  public emitTaskFailed(task: Task, error: string) {
    this.emit('taskFailed', { task, error });
  }
}
