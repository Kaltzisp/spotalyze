export class JSDate extends Date {
    public toExcelDate(): number {
        return (this.getTime() - new Date("1899-12-30").getTime()) / (1000 * 60 * 60 * 24);
    }

    public toString(): string {
        const date = this.getDate() < 10 ? `0${this.getDate()}` : this.getDate();
        const month = this.getMonth() + 1 < 10 ? `0${this.getMonth() + 1}` : this.getMonth() + 1;
        const year = this.getFullYear();
        return `${date}-${month}-${year}`;
    }
}
