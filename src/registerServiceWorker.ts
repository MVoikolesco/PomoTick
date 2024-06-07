// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        // Aqui você pode notificar o usuário que uma nova versão está disponível
        console.log('Nova versão disponível. Atualize a página.');
    },
    onOfflineReady() {
        console.log('O aplicativo está pronto para ser usado offline.');
    },
});
