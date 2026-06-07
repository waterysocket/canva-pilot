import keytar from 'keytar';

export class KeyManager {
  private static readonly SERVICE_NAME = 'CanvaPilot';

  public static async setApiKey(provider: string, key: string): Promise<void> {
    try {
      await keytar.setPassword(this.SERVICE_NAME, provider, key);
    } catch (error) {
      console.error(`Failed to securely save API key for ${provider}`, error);
      throw error;
    }
  }

  public static async getApiKey(provider: string): Promise<string | null> {
    try {
      return await keytar.getPassword(this.SERVICE_NAME, provider);
    } catch (error) {
      console.error(`Failed to retrieve API key for ${provider}`, error);
      return null;
    }
  }

  public static async deleteApiKey(provider: string): Promise<boolean> {
    try {
      return await keytar.deletePassword(this.SERVICE_NAME, provider);
    } catch (error) {
      console.error(`Failed to delete API key for ${provider}`, error);
      return false;
    }
  }
}
