// clase con datos de las personas
class DatoPersona {
  // metodo constructor que inicializa objeto
  constructor(genero, edad, estatura, peso, actividad) {
    this.genero = genero;
    this.edad = edad;
    this.estatura = estatura;
    this.peso = peso;
    this.actividad = actividad;
  }

  // menu de selecion de genero
  generoSelecionado() {
    if (this.genero === "hombre") {
      return this.ecuacionHombre();
    } else if (this.genero === "mujer") {
      return this.ecuacionMujer();
    } else {
      console.log("ERROR");
    }
  }

  // calculo tasa metabolica basal masculina
  ecuacionHombre() {
    const hombre =
      88.36 +
      13.4 * this.peso +
      4.8 * this.estatura -
      5.7 * this.edad * this.ecuacionActividad();
    return hombre;
  }

  // calculo para sacar el TMB femenino
  ecuacionMujer() {
    const mujer =
      447.6 +
      9.2 * this.peso +
      3.1 * this.estatura -
      4.3 * this.edad * this.ecuacionActividad();
    return mujer;
  }

  // calcular la actividad
  ecuacionActividad() {
    switch (this.actividad) {
      case "sedentario":
        return 1.2;
      case "ligera":
        return 1.375;
      case "moderada":
        return 1.55;
      case "intensa":
        return 1.725;
      case "muy-intensa":
        return 1.9;
      default:
        console.log("ERROR metodo; ecuacionActividad()");
        break;
    }
  }

  // indice de masa corporal
  ecuacionImc() {
    let peso = this.peso;
    let estatura = this.estatura;
    let acumuloImc = "";

    // transformo la estatura a dcimal xq desde el form llega como numeros enteros
    let estaturaDecimal = parseFloat(
      estatura.toString().slice(0, -2) + "." + estatura.toString().slice(-2)
    );

    // calculo al iindice de masa corportal
    let imc = peso / estaturaDecimal ** 2; // ** potencia

    if (imc < 18.5) {
      acumuloImc += "Insuficiente";
    } else if (imc >= 18.5 && imc <= 24.9) {
      acumuloImc += "Normal";
    } else if (imc >= 25 && imc <= 29.9) {
      acumuloImc += "Sobrepeso";
    } else if (imc >= 30) {
      acumuloImc += "Obesidad";
    } else {
      console.log("ERROR: no se pudo calcular el IMC");
    }

    return acumuloImc;
  }
}

// vars y cargo mis atributos del html
const formulario = document.getElementById("formulario");
const h2 = document.querySelector("h2");
const cargando = document.getElementById("cargando");
const resultadoDiv = document.getElementById("resultado");
const estadisticasDiv = document.getElementById("estadisticas");
const estadisticasImcDiv = document.getElementById("estadisticas-imc");
const mayorImcDiv = document.getElementById("mayor-imc");
const menorImcDiv = document.getElementById("menor-imc");
const acumuloResultado =
  JSON.parse(localStorage.getItem("datosImcGuardados")) || [];

// formateo la fecha
const formatearFecha = () => {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // le sumo 1 xq el mes empieza en 0 (enero)
  const anio = fecha.getFullYear();
  const hora = fecha.getHours();
  const minutos = fecha.getMinutes();
  const segundos = fecha.getSeconds();
  return (fechaFormateada = `${dia}/${mes}/${anio} - ${hora}:${minutos}:${segundos}`);
};

// recibo del form
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  // obtengo los valores del form
  const genero = document.querySelector('input[name="sexo"]:checked').value;
  const peso = Number(document.getElementById("peso").value);
  const estatura = Number(document.getElementById("estatura").value);
  const edad = Number(document.getElementById("edad").value);
  const actividad = document.getElementById("actividad").value;

  // instancio obj
  const resultado = new DatoPersona(genero, edad, estatura, peso, actividad);

  // guardo los datos
  acumuloResultado.push({
    datos: resultado.generoSelecionado(),
    fecha: formatearFecha(),
    imc: resultado.ecuacionImc(),
  });

  // guardo los datos en el localstorage
  localStorage.setItem("datosImcGuardados", JSON.stringify(acumuloResultado));

  // envio el resultado como param
  muestroResultado(resultado.generoSelecionado());
});

// ultimas Tmb
const ultimosTmb = (estadisticasDiv) => {
  let estadisticaTmb = "";
  acumuloResultado.map((elementos) => {
    estadisticaTmb += `<p><strong>Ultimo TMB:</strong> ${
      elementos.fecha
    }: ${parseInt(elementos.datos)}</p>`;
  });
  return (estadisticasDiv.innerHTML = estadisticaTmb);
};

// estadisticas Imc
const estadisticasImc = (estadisticasImcDiv) => {
  let estadisticaImc = "";
  acumuloResultado.map((elementos) => {
    estadisticaImc += `<p><strong>Ultimo IMC:</strong> ${elementos.imc}</p>`;
  });
  return (estadisticasImcDiv.innerHTML = estadisticaImc);
};
const mayorImc = (mayorImcDiv) => {
  let mayorImc = 0;
  acumuloResultado.filter((elementos) => {
    mayorImc += elementos.imc == "Obesidad";
  });
  return (mayorImcDiv.innerHTML = `Personas con Obesidad: ${mayorImc}`);
};
const menorImc = (menorImcDiv) => {
  let menorImc = 0;
  acumuloResultado.filter((elementos) => {
    menorImc += elementos.imc == "Insuficiente";
    console.log(typeof menorImc);
  });
  return (menorImcDiv.innerHTML = `Personas con peso Insuficiente: ${menorImc}`);
};

// resultado final
const muestroResultado = (resultado) => {
  // cambio texto segun el caso
  if (
    h2.textContent == "Calcule su TMB y vea los resultados aqui" ||
    h2.textContent == "Resultado"
  ) {
    // cambio txt del h2
    h2.innerHTML = "Resultado";

    // simulo spinner
    cargando.innerHTML = `<svg class="ring" viewBox="25 25 50 50" stroke-width="5"><circle cx="50" cy="50" r="20" /></svg>`;

    // muestro carga
    cargando.style.display = "block";

    // oculto el resultado mientras carga
    resultadoDiv.style.display = "none";
    estadisticasDiv.style.display = "none";
    estadisticasImcDiv.style.display = "none";
    mayorImcDiv.style.display = "none";
    menorImcDiv.style.display = "none";

    // simulo asincronismo xd
    setTimeout(() => {
      // oculto el spinner
      cargando.style.display = "none";
      // muestro divs
      resultadoDiv.style.display = "block";
      estadisticasDiv.style.display = "block";
      estadisticasImcDiv.style.display = "block";
      mayorImcDiv.style.display = "block";
      menorImcDiv.style.display = "block";

      // imprimo el result
      !isNaN(resultado)
        ? 
          (
            resultadoDiv.innerHTML = `
            <p><strong>Metabolismo basal:</strong> ${parseInt(resultado)}</p>
            <p><strong>Calorías necesarias para mantener el peso:</strong> ${parseInt(
              resultado + 200
            )}</p>
            <p><strong>Calorías para adelgazar:</strong> ${parseInt(
              resultado - 500
            )}</p>
            <p><strong>Calorías para subir de peso:</strong> ${parseInt(
              resultado + 500
            )}</p>`
          )
          : 
          (
            resultadoDiv.innerHTML = `Rellena tus datos y ve el resultado aqui 😁`
          )

      // imprimo estadisticas
      ultimosTmb(estadisticasDiv);
      estadisticasImc(estadisticasImcDiv);
      mayorImc(mayorImcDiv);
      menorImc(menorImcDiv);
    }, 500);
  }

  formulario.reset()
};

muestroResultado();
