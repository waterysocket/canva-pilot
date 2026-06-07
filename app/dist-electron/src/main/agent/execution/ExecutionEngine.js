import { AutomationEngine } from '../../automation/AutomationEngine.js';
import { ExecutionMonitor } from '../../events/ExecutionMonitor.js';
import { RecoveryEngine } from '../recovery/RecoveryEngine.js';
export class ExecutionEngine {
    automationEngine;
    monitor;
    recoveryEngine;
    constructor() {
        this.automationEngine = AutomationEngine.getInstance();
        this.monitor = ExecutionMonitor.getInstance();
        this.recoveryEngine = new RecoveryEngine();
    }
    async executePlan(task, plan, providerId) {
        this.monitor.emitTaskStarted(task);
        let currentPlan = plan;
        for (let i = 0; i < currentPlan.steps.length; i++) {
            const step = currentPlan.steps[i];
            step.status = 'running';
            this.monitor.emitTaskUpdated(task, step);
            try {
                await this.executeStep(step);
                step.status = 'completed';
                this.monitor.emitTaskUpdated(task, step);
            }
            catch (error) {
                step.status = 'failed';
                this.monitor.emitTaskUpdated(task, step);
                console.error(`Step failed: ${step.action}`, error);
                const recoveredPlan = await this.recoveryEngine.diagnoseAndRecover(currentPlan, error.message, providerId);
                if (recoveredPlan) {
                    currentPlan = recoveredPlan;
                    i = -1; // Restart loop on the recovered plan from the beginning of its remaining steps
                    continue;
                }
                else {
                    this.monitor.emitTaskFailed(task, error.message);
                    return false;
                }
            }
        }
        this.monitor.emitTaskCompleted(task);
        return true;
    }
    async executeStep(step) {
        // A real implementation maps the step to the ContextEngine ActionDefinition
        switch (step.action) {
            case 'click':
                if (step.target)
                    await this.automationEngine.click(step.target);
                break;
            case 'type':
                if (step.target && step.value)
                    await this.automationEngine.type(step.target, step.value);
                break;
            case 'navigate':
                if (step.target)
                    await this.automationEngine.navigate(step.target);
                break;
            case 'observe':
            case 'verify':
                // Wait or take a screenshot
                await new Promise(r => setTimeout(r, 1000));
                break;
            default:
                throw new Error(`Unknown action: ${step.action}`);
        }
    }
}
