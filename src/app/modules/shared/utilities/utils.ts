export class Utils {
    public static generateKey() {
        function S4() {
            return Math.floor((1 + Math.random()) * 0x1000)
                .toString(16)
                .substring(1);
        }
        return S4() + S4() + S4() + S4() + S4();
    }

    public static generateGUID() {
        function S4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return S4() + S4() + S4() + S4() + S4() + S4() + S4();
    }

    public static generateRequestId() {
        function S4() {
            return Math.floor(Math.random() * 900000000) + 10000000;
        }
        return S4();
    }
}

