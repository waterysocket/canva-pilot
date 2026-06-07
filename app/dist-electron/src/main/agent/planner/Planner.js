import { ProviderManager } from '../../providers/ProviderManager.js';
import { ContextEngine } from '../../context/ContextEngine.js';
import { v4 as uuidv4 } from 'uuid';
export class Planner {
    providerManager;
    contextEngine;
    constructor() {
        this.providerManager = ProviderManager.getInstance();
        this.contextEngine = ContextEngine.getInstance();
    }
    async createPlan(task, providerId) {
        const provider = this.providerManager.getReasoningProvider(providerId);
        const context = this.contextEngine.getActiveContext();
        // In a full implementation, you would format a complex prompt containing the goal,
        // the UI map, available actions, and workflows from the active context.
        const prompt = `Create an automation plan for the following goal: ${task.goal}\nContext: ${context?.name || 'Generic'}`;
        // Simulated plan generation (the provider would normally return this structured)
        // const generatedPlan = await provider.plan(prompt, context);
        const plan = {
            id: uuidv4(),
            taskId: task.id,
            steps: [
                { id: uuidv4(), action: 'observe', status: 'pending', retryCount: 0 },
                { id: uuidv4(), action: 'click', target: 'DesignButton', status: 'pending', retryCount: 0 },
                { id: uuidv4(), action: 'verify', status: 'pending', retryCount: 0 }
            ],
            createdAt: new Date()
        };
        return plan;
    }
    async validatePlan(plan) {
        // Check if actions exist in context engine
        return plan.steps.length > 0;
    }
    async repairPlan(failedPlan, failureReason, providerId) {
        const provider = this.providerManager.getReasoningProvider(providerId);
        // return await provider.replan(failedPlan, failureReason, {});
        // Mock replan
        return {
            ...failedPlan,
            id: uuidv4(),
            steps: [
                ...failedPlan.steps.filter((s) => s.status !== 'failed'),
                { id: uuidv4(), action: 'observe', status: 'pending', retryCount: 0 }
            ]
        };
    }
}
