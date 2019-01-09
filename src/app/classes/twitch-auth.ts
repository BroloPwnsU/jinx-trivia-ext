export class TwitchAuth {
    Token: string;
    ChannelID: string;
    UserID: string;
    Role: string;

    isEmpty(): boolean {
        return (this.Token == null || this.Token == '')
            && (this.ChannelID == null || this.ChannelID == '')
            && (this.UserID == null || this.UserID == '')
            && (this.Role == null || this.Role == '');
    }
}