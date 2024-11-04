export class JSDate extends Date {
    public toExcelDate(): number {
        return (this.getTime() - new Date("1899-12-30").getTime()) / (1000 * 60 * 60 * 24);
    }
}
