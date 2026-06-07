import { Planner } from './planner/Planner.js';
import { ExecutionEngine } from './execution/ExecutionEngine.js';
import { TaskRepository } from '../database/repositories/TaskRepository.js';
import { v4 as uuidv4 } from 'uuid';
import { ExecutionMonitor } from '../events/ExecutionMonitor.js';
import { ContextEngine } from '../context/ContextEngine.js';
export class AgentOrchestrator {
    planner;
    executionEngine;
    taskRepo;
    monitor;
    contextEngine;
    constructor() {
        this.planner = new Planner();
        this.executionEngine = new ExecutionEngine();
        this.taskRepo = new TaskRepository();
        this.monitor = ExecutionMonitor.getInstance();
        this.contextEngine = ContextEngine.getInstance();
    }
    async startTask(goal, providerId, contextPack = 'canva') {
        const task = {
            id: uuidv4(),
            goal,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            contextPackId: contextPack
        };
        this.taskRepo.createTask(task);
        // Load context for the task
        await this.contextEngine.loadContext(contextPack);
        // Start asynchronously to not block the caller
        this.runTaskLoop(task, providerId).catch(err => {
            console.error(`Task ${task.id} failed fundamentally`, err);
        });
        return task.id;
    }
    async runTaskLoop(task, providerId) {
        try {
            task.status = 'running';
            this.taskRepo.updateTaskStatus(task.id, task.status);
            // 1. Planning
            const plan = await this.planner.createPlan(task, providerId);
            const isValid = await this.planner.validatePlan(plan);
            if (!isValid)
                throw new Error("Generated plan is invalid");
            // 2. Execution
            const success = await this.executionEngine.executePlan(task, plan, providerId);
            // 3. Completion
            task.status = success ? 'completed' : 'failed';
            this.taskRepo.updateTaskStatus(task.id, task.status);
        }
        catch (error) {
            task.status = 'failed';
            this.taskRepo.updateTaskStatus(task.id, task.status);
            this.monitor.emitTaskFailed(task, String(error));
        }
    }
    pauseTask(taskId) {
        // Implementation for pausing
    }
    resumeTask(taskId) {
        // Implementation for resuming
    }
    cancelTask(taskId) {
        this.taskRepo.updateTaskStatus(taskId, 'cancelled');
        // Implementation for aborting execution
    }
}
