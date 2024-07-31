
export default class Files {
    private config: Record<string, any> = {}

    constructor(config: Record<string, any>) {
        this.config = config
    }
    orgLogo(filename: string) {
        return this.config.files.storage_url + filename
    }

}