import keytar from 'keytar';
export class KeyManager {
    static SERVICE_NAME = 'CanvaPilot';
    static async setApiKey(provider, key) {
        try {
            await keytar.setPassword(this.SERVICE_NAME, provider, key);
        }
        catch (error) {
            console.error(`Failed to securely save API key for ${provider}`, error);
            throw error;
        }
    }
    static async getApiKey(provider) {
        try {
            return await keytar.getPassword(this.SERVICE_NAME, provider);
        }
        catch (error) {
            console.error(`Failed to retrieve API key for ${provider}`, error);
            return null;
        }
    }
    static async deleteApiKey(provider) {
        try {
            return await keytar.deletePassword(this.SERVICE_NAME, provider);
        }
        catch (error) {
            console.error(`Failed to delete API key for ${provider}`, error);
            return false;
        }
    }
}
