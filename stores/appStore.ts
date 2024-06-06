export const useCountdownStore = defineStore('countdown', {
    state: () => ({
        countdown: 15,
        workTime: 15,
        interval: 5,
        cycles: 4,
        postCycleInterval: 60,
        cycleCompleted: false,
        cycleCompletedIs: 'work'
    }),

    actions: {
        setWorkTime(time: number) {
            this.workTime = time;
        },
        setInterval(interval: number) {
            this.interval = interval;
        },
        setCycleInterval(interval: number) {
            this.cycles = interval;
        },
        setPostCycleInterval(interval: number) {
            this.postCycleInterval = interval;
        },
        setCycleCompleted(value: boolean) {
            this.cycleCompleted = value;
        },
        setCycleCompletedIs(status: string, value: boolean) {
            this.setCycleCompleted(value);
            this.cycleCompletedIs = status;
        },
        setCountdown(countdown: number) {
            this.countdown = countdown;
        }
    }
})