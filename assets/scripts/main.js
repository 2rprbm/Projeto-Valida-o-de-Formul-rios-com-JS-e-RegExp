const inputDigitado = document.querySelectorAll(".input")
inputDigitado.forEach(input => {
    input.addEventListener("blur", (evento) => {
        const inputVerificado = evento.target.dataset.tipo   
        if(validadores[inputVerificado]){
            validadores[inputVerificado](input)
        }
        if(!input.validity.valid){
            input.parentElement.classList.add("input-container--invalido")
            const mensagemErroHtml = input.parentElement.querySelector(".input-mensagem-erro")
            mensagemErroHtml.innerHTML = mensagensDeErro[inputVerificado].customError
        } else{
            input.parentElement.classList.remove("input-container--invalido")
            const mensagemErroHtml = input.parentElement.querySelector(".input-mensagem-erro")
            mensagemErroHtml.innerHTML = ''
        }
    })
});

 const mensagensDeErro = {
     nome: {customError: 'O número de caracteres é menor do que o esperado. No mínimo 3 caracteres'},
     email: {customError: 'O email está no formato incorreto. Digite no mínimo 1 caracter, @ e mais 1 caracter '},
     senha: {customError: 'A senha deve conter pelo menos 8 caracteres, sendo pelo menos uma letra maiúscula, uma letra minúscula e um número.'},
     dataNascimento: {customError: 'Você deve ser maior que 18 anos para se cadastrar.'},
     cpf: {customError: 'O CPF digitado não é válido.' },
     cep: {customError: 'Não foi possível buscar o CEP.'}
 }

const validadores = {
    nome:input => validaNome(input),
    email:input => validaEmail(input),
    senha:input => validaSenha(input),
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCpf(input),
    cep:input => validaCep(input)
}

function validaCep(){
    const campoDigitado = document.querySelector("#cep")
    const cepDigitado = campoDigitado.value
    document.querySelector("#logradouro").value = ""
    document.querySelector("#cidade").value = ""
    document.querySelector("#estado").value = ""
    preencheCampos(cepDigitado)
}

async function preencheCampos(cepDigitado){
    try{
        const enderecoCompleto = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`)
        const enderecoCompletoConvertido = await enderecoCompleto.json()
        if(enderecoCompletoConvertido.erro){
            const campoDigitado = document.querySelector("#cep")
            campoDigitado.setCustomValidity("CEP Inválido")
        }else{
            document.querySelector("#logradouro").value = enderecoCompletoConvertido.logradouro
            document.querySelector("#cidade").value = enderecoCompletoConvertido.localidade
            document.querySelector("#estado").value = enderecoCompletoConvertido.uf
            document.querySelector("#cep").setCustomValidity('')
        }
    } catch(erro){
        alert(erro)
    }
}

function validaCpf(){
    const inputCpf = document.querySelector("#cpf")
    const cpfDigitado = inputCpf.value
    const validaCpf = new RegExp("^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$")
    if(!validaCpf.test(cpfDigitado)){
        inputCpf.setCustomValidity("formato invalido")
        inputCpf.value = ""
    }else{
        inputCpf.setCustomValidity('')
    }
}

function validaNome(){
    const inputNome = document.querySelector("#nome")
    const nomeDigitado = inputNome.value
    console.log(nomeDigitado)
    console.log(inputNome.validity)
    const validaNome = new RegExp("^[a-zA-Z]{3,30}$")
    if(!validaNome.test(nomeDigitado)){
        inputNome.setCustomValidity("nome invalido")
        inputNome.value = ""
    }else{
        inputNome.setCustomValidity('')
    }
}

function validaEmail(){
    const inputEmail = document.querySelector("#email")
    const emailDigitado = inputEmail.value
    const validaEmail = new RegExp("^[a-zA-Z0-9].*@.+$")
    if(!validaEmail.test(emailDigitado)){
        inputEmail.setCustomValidity("email invalido")
        inputEmail.value = ""
    }else{
        inputEmail.setCustomValidity('')
    }
}

function validaSenha(){
    const inputSenha = document.querySelector("#senha")
    const senhaDigitada = inputSenha.value
    const validaSenha = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$")
    if(!validaSenha.test(senhaDigitada)){
        inputSenha.setCustomValidity("senha invalida")
        inputSenha.value = ""
    }else{
        inputSenha.setCustomValidity('')
    }
}

function validaDataNascimento(){
    const inputNascimento = document.querySelector("#nascimento")
    const nascimentoDigitado = inputNascimento.value
    const dataNascimentoDigitada = new Date(nascimentoDigitado)
    const dataAtual = new Date()
    const dataMaiorIdade = new Date(dataNascimentoDigitada.getUTCFullYear()+18, dataNascimentoDigitada.getUTCMonth(), dataNascimentoDigitada.getUTCDay())
    if(dataAtual<dataMaiorIdade){
        inputNascimento.setCustomValidity("data de nascimento invalida")
        inputNascimento.value = ""
    }else{
        inputNascimento.setCustomValidity('')
    }
}