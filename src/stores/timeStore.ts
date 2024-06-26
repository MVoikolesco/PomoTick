import { defineStore } from "pinia";

export const useTimerStore = defineStore('timer', {
    state: () => ({
        time: 0,
        timeLeft: 0,
        timer: null as number | null,
        paused: false,

        countdown: 1500,
        workTime: 1500,
        interval: 300,
        cycles: 4,
        postCycleInterval: 60,
        cycleCompleted: false,
        cycleCompletedIs: 'work'
    }),

    actions: {
        setTime(newTime: number) {
            this.time = newTime;
            this.timeLeft = newTime * 1000;
        },
        startTimer() {
            // @ts-ignore
            clearInterval(this.timer);
            this.paused = false;
            // @ts-ignore
            this.timer = setInterval(() => {
                if (!this.paused) {
                    if (this.timeLeft > 0) {
                        this.timeLeft -= 100;
                    } else {
                        // @ts-ignore

                        clearInterval(this.timer);
                        // Aqui você pode emitir um evento ou executar qualquer outra ação quando o temporizador terminar.
                    }
                }
            }, 100);
        },
        stopTimer() {
            // @ts-ignore
            clearInterval(this.timer);
            this.timer = null;
            this.timeLeft = this.time * 1000;
            this.paused = false;
        },
        resumeTimer() {
            this.paused = false;
        },
        pauseTimer() {
            this.paused = true;
        },
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
    },
});