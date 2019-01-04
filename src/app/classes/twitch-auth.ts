export class TwitchAuth {
    token: string;
    userId: string;
    channelId: string;

    isEmpty(): boolean {
        return (this.token == null || this.token == '')
            && (this.channelId == null || this.channelId == '')
            && (this.userId == null || this.userId == '');
    }
}