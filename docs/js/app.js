// ===============================
// RegressionX
// app.js
// ===============================

const numData = document.getElementById("numData");
const generateBtn = document.getElementById("generateBtn");
const calculateBtn = document.getElementById("calculateBtn");

const dataInputs = document.getElementById("dataInputs");

const nilaiA = document.getElementById("nilaiA");
const nilaiB = document.getElementById("nilaiB");

const persamaan = document.getElementById("persamaan");

const hasilPrediksi = document.getElementById("hasilPrediksi");
const predictBtn = document.getElementById("predictBtn");

const predictX = document.getElementById("predictX");

const kesimpulan = document.getElementById("kesimpulan");

let regressionChart = null;

let a = 0;
let b = 0;

// ===============================
// Generate Input
// ===============================

generateBtn.addEventListener("click", () => {

    const jumlah = parseInt(numData.value);

    if (isNaN(jumlah) || jumlah < 2) {

        alert("Minimal data 2");

        return;
    }

    dataInputs.innerHTML = "";

    for (let i = 0; i < jumlah; i++) {

        dataInputs.innerHTML += `

        <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-400 w-16 shrink-0">Data ${i+1}:</span>
            <input
            style="color: white;"
            type="number"
            placeholder="X"
            class="xValue flex-1 px-4 py-2.5 rounded-xl bg-gray-950/40 border border-white/10 outline-none focus:border-cyan-500 transition-colors">
            <input
            style="color: white;"
            type="number"
            placeholder="Y"
            class="yValue flex-1 px-4 py-2.5 rounded-xl bg-gray-950/40 border border-white/10 outline-none focus:border-cyan-500 transition-colors">
        </div>

        `;

    }

    calculateBtn.classList.remove("hidden");

});

// ===============================
// Calculate Regression
// ===============================

calculateBtn.addEventListener("click", () => {

    const xs = [...document.querySelectorAll(".xValue")];

    const ys = [...document.querySelectorAll(".yValue")];

    const x = [];

    const y = [];

    xs.forEach(item=>{

        x.push(Number(item.value));

    });

    ys.forEach(item=>{

        y.push(Number(item.value));

    });

    const n = x.length;
    document.getElementById("totalData").innerHTML=n;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY=0;

    for(let i=0;i<n;i++){

        sumX += x[i];

        sumY += y[i];

        sumXY += x[i]*y[i];

        sumXX += x[i]*x[i];

        sumYY+=y[i]*y[i];

    }

    b =

    (

        (n*sumXY)

        -

        (sumX*sumY)

    )

    /

    (

        (n*sumXX)

        -

        (sumX*sumX)

    );

    if (!isFinite(b)) {
        alert("Perhitungan gagal. Pastikan nilai X tidak semuanya sama.");
        return;
    }

    a =

    (

        sumY

        -

        (b*sumX)

    )

    /

    n;

    const r=

(

n*sumXY-sumX*sumY

)

/

Math.sqrt(

(n*sumXX-sumX*sumX)

*

(n*sumYY-sumY*sumY)

);

    document.getElementById("corr").innerHTML = r.toFixed(4);
    document.getElementById("r2").innerHTML = (r * r).toFixed(4);

    // Calculate RMSE
    let sumSquaredError = 0;
    for (let i = 0; i < n; i++) {
        const yPred = a + (b * x[i]);
        const error = y[i] - yPred;
        sumSquaredError += error * error;
    }
    const mse = sumSquaredError / n;
    const rmseValue = Math.sqrt(mse);
    
    const rmseEl = document.getElementById("rmse");
    if (rmseEl) {
        rmseEl.innerHTML = rmseValue.toFixed(4);
    }

    animateValue("nilaiA",a);
    
    animateValue("nilaiB",b);

    const eqText = `Y = ${a.toFixed(4)} + (${b.toFixed(4)})X`;
    persamaan.innerHTML = eqText;

    const lastEq = document.getElementById("lastEquation");
    if (lastEq) {
        lastEq.innerHTML = eqText;
    }
    
    localStorage.setItem("equation", eqText);

    counter("sumX",sumX);

    counter("sumY",sumY);

    counter("meanX",(sumX/n));

    counter("meanY",(sumY/n));

    generateConclusion();

    if(b>0){

        document.getElementById("relationship").innerHTML="Positive";
        
        document.getElementById("direction").innerHTML="Increasing";
        
        }
        
        else if(b<0){
        
        document.getElementById("relationship").innerHTML="Negative";
        
        document.getElementById("direction").innerHTML="Decreasing";
        
        }
        
        else{
        
        document.getElementById("relationship").innerHTML="Neutral";
        
        document.getElementById("direction").innerHTML="Flat";
        
        }

    document.getElementById("status").innerHTML="Calculated";

    drawChart(x,y);

});

// ===============================
// Prediction
// ===============================

predictBtn.addEventListener("click",()=>{

    const x = Number(predictX.value);

    if(isNaN(x)){

        return;

    }

    const y = a + (b*x);

    hasilPrediksi.innerHTML = y.toFixed(4);

    document.getElementById("predictionText").innerHTML = y.toFixed(4);

});

// ===============================
// Conclusion
// ===============================

function generateConclusion() {
    const formattedA = a.toFixed(4);
    const formattedB = b.toFixed(4);
    const absB = Math.abs(b).toFixed(4);
    
    let hubungan = "netral (tidak ada)";
    let efek = "tidak mempengaruhi";
    let arahEfek = "mempengaruhi";
    
    if (b > 0) {
        hubungan = "<strong>positif</strong>";
        arahEfek = "<strong>meningkatkan</strong>";
        efek = `maka diperkirakan akan ${arahEfek} nilai Y kurang lebih sebesar <strong>${absB}</strong>`;
    } else if (b < 0) {
        hubungan = "<strong>negatif</strong>";
        arahEfek = "<strong>menurunkan</strong>";
        efek = `maka diperkirakan akan ${arahEfek} nilai Y kurang lebih sebesar <strong>${absB}</strong>`;
    } else {
        efek = "maka diperkirakan tidak memberikan perubahan pada nilai Y";
    }

    const htmlContent = `
        <p class="mb-3">Model regresi yang terbentuk adalah <strong>y = ${formattedA} + (${formattedB})x</strong>. Ini mengindikasikan adanya hubungan ${hubungan} antara variabel X dan Y.</p>
        <p class="mb-3">Secara ringkas, setiap kenaikan <strong>1 nilai/angka</strong> pada variabel X, ${efek}.</p>
        <p class="mb-0">Nilai intercept (a) sebesar <strong>${formattedA}</strong> merupakan nilai prediksi untuk Y ketika variabel X bernilai 0.</p>
    `;
    
    const kA = document.getElementById("kesimpulanAnalisis");
    if (kA) {
        kA.innerHTML = htmlContent;
    }
    
    if (kesimpulan) {
        kesimpulan.innerHTML = `Model regresi: Y = ${formattedA} + (${formattedB})X. Hubungan ${b > 0 ? 'positif' : b < 0 ? 'negatif' : 'netral'}.`;
    }
}
// ===============================
// Chart.js
// ===============================

function drawChart(xData, yData) {


    const ctx = document
        .getElementById("chartRegression")
        .getContext("2d");

    if (regressionChart) {
        regressionChart.destroy();
    }

    const regressionData = xData.map(x => ({
        x: x,
        y: a + (b * x)
    }));

    const isLight = document.body.classList.contains("light");
    const textColor = isLight ? "#334155" : "#ffffff";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)";

    regressionChart = new Chart(ctx, {

        type: "scatter",

        data: {

            datasets: [

                {
                    label: "Dataset",

                    data: xData.map((x, i) => ({
                        x: x,
                        y: yData[i]
                    })),

                    backgroundColor:[
                        "#06b6d4",
                        "#8b5cf6",
                        "#ec4899",
                        "#22c55e",
                        "#f59e0b"
                        ],

                    pointRadius:7,

                    hoverRadius:10,
                        
                    pointHoverBorderWidth:3,
                        
                    pointHoverBorderColor:"#ffffff"

                },

                {

                    label: "Regression Line",

                    data: regressionData.sort((a, b) => a.x - b.x),

                    type: "line",

                    borderColor: "#ec4899",

                    borderWidth: 5,

                    fill: false,

                    tension: 0

                }

            ]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {

                        color: textColor

                    }

                }

            },

            scales: {

                x: {

                    title: {

                        display: true,

                        text: "X",

                        color: textColor

                    },

                    ticks: {

                        color: textColor

                    },

                    grid: {

                        color: gridColor

                    }

                },

                y: {

                    title: {

                        display: true,

                        text: "Y",

                        color: textColor

                    },

                    ticks: {

                        color: textColor

                    },

                    grid: {

                        color: gridColor

                    }

                }

            }

        }

    });

}

// ===============================
// Dark Mode
// ===============================

const themeToggle = document.getElementById("themeToggle");

function updateChartColors() {
    if (!regressionChart) return;
    
    const isLight = document.body.classList.contains("light");
    const textColor = isLight ? "#334155" : "#ffffff";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)";
    
    regressionChart.options.scales.x.title.color = textColor;
    regressionChart.options.scales.x.ticks.color = textColor;
    regressionChart.options.scales.x.grid.color = gridColor;
    
    regressionChart.options.scales.y.title.color = textColor;
    regressionChart.options.scales.y.ticks.color = textColor;
    regressionChart.options.scales.y.grid.color = gridColor;
    
    regressionChart.options.plugins.legend.labels.color = textColor;
    
    regressionChart.update();
}

function setTheme(themeName) {
    if (themeName === "light") {
        document.body.classList.add("light");
        document.documentElement.classList.remove("dark");
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun text-yellow-500"></i>';
        }
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        document.documentElement.classList.add("dark");
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon text-cyan-400"></i>';
        }
        localStorage.setItem("theme", "dark");
    }
    updateChartColors();
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = localStorage.getItem("theme") === "light" ? "dark" : "light";
        setTheme(currentTheme);
    });
}

// ===============================
// Reset
// ===============================

function resetCalculator() {

    numData.value = "";

    predictX.value = "";

    dataInputs.innerHTML = "";

    nilaiA.innerHTML = "-";

    nilaiB.innerHTML = "-";

    hasilPrediksi.innerHTML = "-";

    persamaan.innerHTML = "-";

    kesimpulan.innerHTML = "Waiting for calculation...";
    
    const rmseEl = document.getElementById("rmse");
    if (rmseEl) {
        rmseEl.innerHTML = "-";
    }

    const kA = document.getElementById("kesimpulanAnalisis");
    if (kA) {
        kA.innerHTML = `<div class="text-center py-4 text-gray-500">Menunggu perhitungan regresi...</div>`;
    }

    calculateBtn.classList.add("hidden");

    if (regressionChart) {

        regressionChart.destroy();

        regressionChart = null;

    }

}

// ===============================
// Copy Equation
// ===============================

function copyEquation() {

    navigator.clipboard.writeText(

        persamaan.innerText

    );

    showToast("Equation copied!");

}

// ===============================
// Export Chart
// ===============================

function exportChart(){

    if(!regressionChart){
    
    showToast("Chart belum dibuat!");
    
    return;
    
    }
    
    const link=document.createElement("a");
    
    link.download="RegressionChart.png";
    
    link.href=regressionChart.toBase64Image();
    
    link.click();
    
    showToast("Chart downloaded!");
    
    }

// ===============================
// Toast
// ===============================

function showToast(text) {

    const toast = document.createElement("div");

    toast.innerHTML = text;

    toast.style.background="linear-gradient(90deg,#06b6d4,#8b5cf6)";

    toast.style.fontWeight="700";

    toast.style.padding="16px 28px";

    toast.style.borderRadius="20px";

    toast.style.backdropFilter="blur(10px)";

    toast.style.position = "fixed";

    toast.style.bottom = "30px";

    toast.style.right = "30px";

    toast.style.color = "white";

    toast.style.zIndex = "9999";

    toast.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.3)";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

function animateValue(id,value){

let start=0;

let duration=700;

let increment=value/(duration/16);

let obj=document.getElementById(id);

let timer=setInterval(()=>{

start+=increment;

if(start>=value){

start=value;

clearInterval(timer);

}

obj.innerHTML=Number(start).toFixed(2);

},16);

}

const glow=document.querySelector(".cursorGlow");

window.addEventListener("mousemove",(e)=>{
    if (glow) {
        glow.style.left=e.clientX-170+"px";
        glow.style.top=e.clientY-170+"px";
    }
});

// Scroll glass effect on navbar
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add("backdrop-blur-xl");
        } else {
            nav.classList.remove("backdrop-blur-xl");
        }
    }
});

window.onload=()=>{

    setTimeout(()=>{
    
    document.getElementById("loader").style.opacity="0";
    
    setTimeout(()=>{
    
    document.getElementById("loader").remove();
    
    },800);
    
    },1000);

    const saved=

JSON.parse(

localStorage.getItem("dataset")

);

if(saved){

numData.value=saved.length;

generateBtn.click();

setTimeout(()=>{

saved.forEach((item,index)=>{

document.querySelectorAll(".xValue")[index].value=item.x;

document.querySelectorAll(".yValue")[index].value=item.y;

})

},100);

}
    
    }

    function counter(id,target){

        let value=0;
        
        const speed=target/40;
        
        const el=document.getElementById(id);
        
        const timer=setInterval(()=>{
        
        value+=speed;
        
        if(value>=target){
        
        value=target;
        
        clearInterval(timer);
        
        }
        
        el.innerHTML=value.toFixed(2);
        
        },20);
        
        }
        // Set initial theme
        const savedTheme = localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        document.getElementById("saveData").onclick=()=>{

            const xs=[...document.querySelectorAll(".xValue")];
            
            const ys=[...document.querySelectorAll(".yValue")];
            
            let data=[];
            
            xs.forEach((item,index)=>{
            
            data.push({
            
            x:item.value,
            
            y:ys[index].value
            
            })
            
            })
            
            localStorage.setItem(
            
            "dataset",
            
            JSON.stringify(data)
            
            );
            
            showToast("Dataset saved!");
            
            }

            const last=

localStorage.getItem(

"equation"

);

if(last){

document.getElementById(

"lastEquation"

).innerHTML=last;

}

async function exportPDF(){

    const {jsPDF}=window.jspdf;
    
    const pdf=new jsPDF();
    
    pdf.setFontSize(22);
    
    pdf.text("Regression Dashboard",20,20);
    
    pdf.setFontSize(14);
    
    pdf.text("Equation :",20,40);
    
    pdf.text(persamaan.innerText,20,50);
    
    pdf.text("Intercept (a) : "+nilaiA.innerText,20,70);
    
    pdf.text("Slope (b) : "+nilaiB.innerText,20,80);
    
    pdf.text("Prediction : "+hasilPrediksi.innerText,20,100);
    
    pdf.text("Generated by RegressionX",20,280);
    
    pdf.save("Regression_Report.pdf");
    
    showToast("PDF downloaded!");
    
    }

    function exportCSV(){

        const xs=[...document.querySelectorAll(".xValue")];
        
        const ys=[...document.querySelectorAll(".yValue")];
        
        let csv="X,Y\n";
        
        xs.forEach((x,index)=>{
        
        csv+=`${x.value},${ys[index].value}\n`;
        
        });
        
        const blob=new Blob([csv],{
        
        type:"text/csv"
        
        });
        
        const url=URL.createObjectURL(blob);
        
        const a=document.createElement("a");
        
        a.href=url;
        
        a.download="Dataset.csv";
        
        a.click();
        
        URL.revokeObjectURL(url);
        
        showToast("CSV downloaded!");
        
        }