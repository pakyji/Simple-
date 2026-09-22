const { exec } = require('child_process');

module.exports = {
    name: ',update',
    async execute(sock, mek, from) {
        await sock.sendMessage(from, { text: '🔄 **The Syndicate**: Controllo e download degli aggiornamenti da GitHub in corso...' }, { quoted: mek });
        
        exec('git pull', async (error, stdout, stderr) => {
            if (error) {
                await sock.sendMessage(from, { text: `❌ Errore durante l'aggiornamento: ${error.message}` }, { quoted: mek });
                return;
            }
            
            if (stdout.includes('Already up to date.')) {
                await sock.sendMessage(from, { text: '✅ Il bot è già aggiornato all\'ultima versione!' }, { quoted: mek });
                return;
            }

            await sock.sendMessage(from, { text: `✅ **Aggiornamento completato con successo!**\n\n\`\`\`${stdout}\`\`\`\n\n🔄 Riavvio del bot per applicare le modifiche...` }, { quoted: mek });
            
            // Riavvia il processo in modo che bot-hosting riavvii il container con il nuovo codice
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        });
    }
};
