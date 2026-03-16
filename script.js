let equipamentoAtual = 0;

let hashes = {
    1: "4c3fac5ec03496ccc77a909f5ce07da7d1b440936a01a99e71d1c2ddc4ac49d6", // 
    2: "dccc5d01dabcd1c0b9fa89c91e7f4bde603121ee0172b4ff394e6bb30d295e41", // 
    3: "d0f59fb59a72be6647f7c8556d1a28e239bf54517edd0efc719ce1b8d9d0b9d8"  // 
};

let tentativas = {1:3,2:3,3:3};
let desbloqueados = {1:false,2:false,3:false};

async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function abrirModal(num){

    if(desbloqueados[num]) return;

    equipamentoAtual = num;

    document.getElementById("modal").style.display="block";
    document.getElementById("codigoInput").value="";
    document.getElementById("mensagem").innerText="";
    atualizarTentativas();
}

function fecharModal(){
    document.getElementById("modal").style.display="none";
}

function atualizarTentativas(){
    document.getElementById("tentativas").innerText =
        "tentativas restantes: " + tentativas[equipamentoAtual];
}

async function verificarCodigo(){

    if(tentativas[equipamentoAtual] <= 0){
        document.getElementById("mensagem").innerText="acesso bloqueado.";
        return;
    }

    let input = document.getElementById("codigoInput").value.trim().toLowerCase();
    let hashInput = await sha256(input);

    if(hashInput === hashes[equipamentoAtual]){

        desbloqueados[equipamentoAtual] = true;

        let img = document.getElementById("img"+equipamentoAtual);
        img.src = "assets/Unlock.png";
        img.classList.add("unlocked");

        fecharModal();

        verificarProgresso();

    } else {

        tentativas[equipamentoAtual]--;

        if(tentativas[equipamentoAtual] <= 0){

            tentativas[equipamentoAtual] = 0;
            document.getElementById("mensagem").innerText = "sistema bloqueado.";

            setTimeout(()=>{
                fecharModal();
            },1200);

        } else {

            document.getElementById("mensagem").innerText = "chave inválida.";
        }

        document.getElementById("codigoInput").value = "";

        atualizarTentativas();
    }
}

function verificarProgresso(){
    if(desbloqueados[1] && desbloqueados[2] && desbloqueados[3]){
        setTimeout(()=>{
            window.location.href="revelacao.html";
        },1500);
    }
}

function resetar(){
    location.reload();
}

window.onclick = function(event){
    let modal = document.getElementById("modal");
    if(event.target === modal){
        fecharModal();
    }
}