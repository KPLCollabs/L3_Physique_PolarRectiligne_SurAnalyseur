// ============================================================
// PARAMÈTRES
// ============================================================

const A = 1;
const B = 1;

// phi = 45°
const phi = 45 * Math.PI / 180;


// ============================================================
// CHAMP INCIDENT
// ============================================================

const Ex = A * Math.cos(phi);
const Ey = -B * Math.sin(phi);


// ============================================================
// FONCTIONS PHYSIQUES
// ============================================================

function amplitude(theta) {

    return (
        Ex * Math.cos(theta) +
        Ey * Math.sin(theta)
    );
}


function intensite(theta) {

    return amplitude(theta) ** 2;
}


// ============================================================
// RÉCUPÉRATION DES CANVAS
// ============================================================

const vectorCanvas =
    document.getElementById("vectorCanvas");

const graphCanvas =
    document.getElementById("graphCanvas");

const vectorCtx =
    vectorCanvas.getContext("2d");

const graphCtx =
    graphCanvas.getContext("2d");


// ============================================================
// CURSEUR
// ============================================================

const thetaSlider =
    document.getElementById("thetaSlider");

const thetaValue =
    document.getElementById("thetaValue");


// ============================================================
// DIMENSIONS DU CANVAS
// ============================================================

function resizeCanvas(canvas, ctx) {

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


function resizeAll() {

    resizeCanvas(
        vectorCanvas,
        vectorCtx
    );

    resizeCanvas(
        graphCanvas,
        graphCtx
    );

    drawGraph();

    update();
}


// ============================================================
// CALCUL DE L'INTENSITÉ MAXIMALE
// ============================================================

function getMaxIntensity() {

    let maxI = 0;

    for (let i = 0; i <= 1000; i++) {

        const theta =
            2 * Math.PI * i / 1000;

        maxI = Math.max(
            maxI,
            intensite(theta)
        );
    }

    return maxI;
}


// ============================================================
// GRAPHE I(THETA)
// ============================================================

function drawGraph() {

    const rect =
        graphCanvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    graphCtx.clearRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // Marges
    // --------------------------------------------------------

    const left = 65;
    const right = 20;
    const top = 30;
    const bottom = 55;

    const plotWidth =
        width - left - right;

    const plotHeight =
        height - top - bottom;


    // --------------------------------------------------------
    // Intensité maximale
    // --------------------------------------------------------

    const maxI =
        getMaxIntensity() * 1.1;


    // --------------------------------------------------------
    // GRILLE
    // --------------------------------------------------------

    graphCtx.strokeStyle = "#ddd";
    graphCtx.lineWidth = 1;


    // Lignes horizontales

    for (let i = 0; i <= 4; i++) {

        const y =
            top +
            plotHeight * i / 4;

        graphCtx.beginPath();

        graphCtx.moveTo(
            left,
            y
        );

        graphCtx.lineTo(
            left + plotWidth,
            y
        );

        graphCtx.stroke();
    }


    // Lignes verticales

    for (let i = 0; i <= 6; i++) {

        const x =
            left +
            plotWidth * i / 6;

        graphCtx.beginPath();

        graphCtx.moveTo(
            x,
            top
        );

        graphCtx.lineTo(
            x,
            top + plotHeight
        );

        graphCtx.stroke();
    }


    // --------------------------------------------------------
    // AXES
    // --------------------------------------------------------

    graphCtx.strokeStyle = "#333";
    graphCtx.lineWidth = 1.5;

    graphCtx.beginPath();

    graphCtx.moveTo(
        left,
        top
    );

    graphCtx.lineTo(
        left,
        top + plotHeight
    );

    graphCtx.lineTo(
        left + plotWidth,
        top + plotHeight
    );

    graphCtx.stroke();


    // --------------------------------------------------------
    // COURBE I(theta)
    // --------------------------------------------------------

    graphCtx.beginPath();

    for (let i = 0; i <= 1000; i++) {

        const theta =
            2 * Math.PI * i / 1000;

        const thetaDeg =
            theta * 180 / Math.PI;

        const I =
            intensite(theta);

        const x =
            left +
            thetaDeg / 360 * plotWidth;

        const y =
            top +
            plotHeight -
            I / maxI * plotHeight;


        if (i === 0) {

            graphCtx.moveTo(
                x,
                y
            );

        } else {

            graphCtx.lineTo(
                x,
                y
            );
        }
    }

    graphCtx.strokeStyle = "blue";

    graphCtx.lineWidth = 2.5;

    graphCtx.stroke();


    // --------------------------------------------------------
    // GRADUATIONS X
    // --------------------------------------------------------

    graphCtx.fillStyle = "#222";

    graphCtx.font = "13px Arial";

    graphCtx.textAlign = "center";


    for (let deg = 0; deg <= 360; deg += 60) {

        const x =
            left +
            deg / 360 * plotWidth;

        graphCtx.fillText(
            deg + "°",
            x,
            top + plotHeight + 25
        );
    }


    // --------------------------------------------------------
    // GRADUATIONS Y
    // --------------------------------------------------------

    graphCtx.textAlign = "right";


    for (let i = 0; i <= 4; i++) {

        const value =
            maxI * i / 4;

        const y =
            top +
            plotHeight -
            i / 4 * plotHeight;

        graphCtx.fillText(
            value.toFixed(2),
            left - 10,
            y + 4
        );
    }


    // --------------------------------------------------------
    // TITRE
    // --------------------------------------------------------

    graphCtx.textAlign = "center";

    graphCtx.font = "bold 16px Arial";

    graphCtx.fillText(
        "Intensité en sortie de l’analyseur",
        width / 2,
        20
    );


    // --------------------------------------------------------
    // LABEL X
    // --------------------------------------------------------

    graphCtx.font = "14px Arial";

    graphCtx.fillText(
        "θ (°)",
        left + plotWidth / 2,
        height - 10
    );


    // --------------------------------------------------------
    // LABEL Y
    // --------------------------------------------------------

    graphCtx.save();

    graphCtx.translate(
        18,
        top + plotHeight / 2
    );

    graphCtx.rotate(
        -Math.PI / 2
    );

    graphCtx.fillText(
        "I",
        0,
        0
    );

    graphCtx.restore();
}


// ============================================================
// CADRAN VECTORIEL
// ============================================================

function drawVector(thetaDeg) {

    const rect =
        vectorCanvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    vectorCtx.clearRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // CENTRE
    // --------------------------------------------------------

    const cx = width / 2;
    const cy = height / 2;


    // --------------------------------------------------------
    // LONGUEUR DU CADRAN
    // --------------------------------------------------------

    const E_norm =
        Math.sqrt(
            Ex ** 2 +
            Ey ** 2
        );

    const L =
        1.4 * E_norm;


    // --------------------------------------------------------
    // ÉCHELLE
    // --------------------------------------------------------

    const scale =
        Math.min(
            width,
            height
        ) * 0.38 / L;


    // --------------------------------------------------------
    // COORDONNÉES ÉCRAN
    // --------------------------------------------------------

    function screenX(x) {

        return cx + x * scale;
    }


    function screenY(y) {

        return cy - y * scale;
    }


    // --------------------------------------------------------
    // GRILLE
    // --------------------------------------------------------

    vectorCtx.strokeStyle = "#e5e5e5";

    vectorCtx.lineWidth = 1;

    const gridStep = 0.5;


    for (
        let x = -L;
        x <= L;
        x += gridStep
    ) {

        vectorCtx.beginPath();

        vectorCtx.moveTo(
            screenX(x),
            screenY(-L)
        );

        vectorCtx.lineTo(
            screenX(x),
            screenY(L)
        );

        vectorCtx.stroke();
    }


    for (
        let y = -L;
        y <= L;
        y += gridStep
    ) {

        vectorCtx.beginPath();

        vectorCtx.moveTo(
            screenX(-L),
            screenY(y)
        );

        vectorCtx.lineTo(
            screenX(L),
            screenY(y)
        );

        vectorCtx.stroke();
    }


    // --------------------------------------------------------
    // AXES X ET Y
    // --------------------------------------------------------

    vectorCtx.strokeStyle = "black";

    vectorCtx.lineWidth = 1.5;

    vectorCtx.beginPath();

    vectorCtx.moveTo(
        screenX(-L),
        screenY(0)
    );

    vectorCtx.lineTo(
        screenX(L),
        screenY(0)
    );

    vectorCtx.moveTo(
        screenX(0),
        screenY(-L)
    );

    vectorCtx.lineTo(
        screenX(0),
        screenY(L)
    );

    vectorCtx.stroke();


    // --------------------------------------------------------
    // LABELS X ET Y
    // --------------------------------------------------------

    vectorCtx.fillStyle = "#222";

    vectorCtx.font = "14px Arial";

    vectorCtx.fillText(
        "x",
        screenX(L) - 15,
        screenY(0) - 8
    );

    vectorCtx.fillText(
        "y",
        screenX(0) + 8,
        screenY(L) + 15
    );


    // --------------------------------------------------------
    // ANGLE THETA
    // --------------------------------------------------------

    const theta =
        thetaDeg * Math.PI / 180;


    const ux =
        Math.cos(theta);

    const uy =
        Math.sin(theta);


    // --------------------------------------------------------
    // AXE DE L'ANALYSEUR
    // --------------------------------------------------------

    drawLine(
        0,
        0,
        L * ux,
        L * uy,
        "purple",
        3,
        false
    );


    // Axe opposé

    drawLine(
        0,
        0,
        -L * ux,
        -L * uy,
        "purple",
        1.5,
        true
    );


    // --------------------------------------------------------
    // CHAMP INCIDENT
    // --------------------------------------------------------

    drawArrow(
        0,
        0,
        Ex,
        Ey,
        "red",
        4
    );


    // --------------------------------------------------------
    // PROJECTION
    // --------------------------------------------------------

    const Eproj =
        amplitude(theta);


    const Ex_proj =
        Eproj * ux;

    const Ey_proj =
        Eproj * uy;


    drawArrow(
        0,
        0,
        Ex_proj,
        Ey_proj,
        "green",
        5
    );


    // --------------------------------------------------------
    // PERPENDICULAIRE
    // --------------------------------------------------------

    drawLine(
        Ex,
        Ey,
        Ex_proj,
        Ey_proj,
        "gray",
        1.5,
        true
    );


    // --------------------------------------------------------
    // POINT DU CHAMP INCIDENT
    // --------------------------------------------------------

    vectorCtx.fillStyle = "red";

    vectorCtx.beginPath();

    vectorCtx.arc(
        screenX(Ex),
        screenY(Ey),
        6,
        0,
        2 * Math.PI
    );

    vectorCtx.fill();


    // --------------------------------------------------------
    // TITRE
    // --------------------------------------------------------

    vectorCtx.fillStyle = "#222";

    vectorCtx.font = "bold 16px Arial";

    vectorCtx.textAlign = "center";

    vectorCtx.fillText(
        "Projection de E incident",
        width / 2,
        22
    );


    // --------------------------------------------------------
    // VALEUR DE THETA
    // --------------------------------------------------------

    vectorCtx.textAlign = "left";

    vectorCtx.font = "14px Arial";

    vectorCtx.fillText(
        `θ = ${thetaDeg.toFixed(0)}°`,
        15,
        50
    );


    // --------------------------------------------------------
    // BOÎTE D'INFORMATIONS
    // --------------------------------------------------------

    const infoX = 15;
    const infoY = height - 75;

    vectorCtx.fillStyle =
        "rgba(255,255,255,0.9)";

    vectorCtx.strokeStyle = "#aaa";

    vectorCtx.beginPath();

    vectorCtx.roundRect(
        infoX,
        infoY,
        150,
        55,
        8
    );

    vectorCtx.fill();

    vectorCtx.stroke();


    vectorCtx.fillStyle = "#222";

    vectorCtx.fillText(
        `E_sortie = ${Eproj.toFixed(3)}`,
        infoX + 10,
        infoY + 22
    );

    vectorCtx.fillText(
        `I = ${intensite(theta).toFixed(3)}`,
        infoX + 10,
        infoY + 43
    );
}


// ============================================================
// DESSIN D'UNE LIGNE
// ============================================================

function drawLine(
    x1,
    y1,
    x2,
    y2,
    color,
    lineWidth,
    dashed = false
) {

    const rect =
        vectorCanvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;


    const cx = width / 2;
    const cy = height / 2;


    const E_norm =
        Math.sqrt(
            Ex ** 2 +
            Ey ** 2
        );


    const L =
        1.4 * E_norm;


    const scale =
        Math.min(
            width,
            height
        ) * 0.38 / L;


    const sx1 =
        cx + x1 * scale;

    const sy1 =
        cy - y1 * scale;

    const sx2 =
        cx + x2 * scale;

    const sy2 =
        cy - y2 * scale;


    vectorCtx.save();

    vectorCtx.strokeStyle =
        color;

    vectorCtx.lineWidth =
        lineWidth;


    if (dashed) {

        vectorCtx.setLineDash(
            [8, 6]
        );
    }


    vectorCtx.beginPath();

    vectorCtx.moveTo(
        sx1,
        sy1
    );

    vectorCtx.lineTo(
        sx2,
        sy2
    );

    vectorCtx.stroke();

    vectorCtx.restore();
}


// ============================================================
// DESSIN D'UNE FLÈCHE
// ============================================================

function drawArrow(
    x1,
    y1,
    x2,
    y2,
    color,
    lineWidth
) {

    const rect =
        vectorCanvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;


    const cx = width / 2;
    const cy = height / 2;


    const E_norm =
        Math.sqrt(
            Ex ** 2 +
            Ey ** 2
        );


    const L =
        1.4 * E_norm;


    const scale =
        Math.min(
            width,
            height
        ) * 0.38 / L;


    const sx1 =
        cx + x1 * scale;

    const sy1 =
        cy - y1 * scale;

    const sx2 =
        cx + x2 * scale;

    const sy2 =
        cy - y2 * scale;


    // --------------------------------------------------------
    // CORPS DE LA FLÈCHE
    // --------------------------------------------------------

    vectorCtx.strokeStyle =
        color;

    vectorCtx.fillStyle =
        color;

    vectorCtx.lineWidth =
        lineWidth;


    vectorCtx.beginPath();

    vectorCtx.moveTo(
        sx1,
        sy1
    );

    vectorCtx.lineTo(
        sx2,
        sy2
    );

    vectorCtx.stroke();


    // --------------------------------------------------------
    // POINTE
    // --------------------------------------------------------

    const angle =
        Math.atan2(
            sy2 - sy1,
            sx2 - sx1
        );


    const arrowLength = 12;

    const arrowAngle =
        Math.PI / 7;


    vectorCtx.beginPath();

    vectorCtx.moveTo(
        sx2,
        sy2
    );


    vectorCtx.lineTo(
        sx2 -
        arrowLength *
        Math.cos(
            angle - arrowAngle
        ),

        sy2 -
        arrowLength *
        Math.sin(
            angle - arrowAngle
        )
    );


    vectorCtx.lineTo(
        sx2 -
        arrowLength *
        Math.cos(
            angle + arrowAngle
        ),

        sy2 -
        arrowLength *
        Math.sin(
            angle + arrowAngle
        )
    );


    vectorCtx.closePath();

    vectorCtx.fill();
}


// ============================================================
// MISE À JOUR
// ============================================================

function update() {

    const thetaDeg =
        Number(thetaSlider.value);


    // Affichage de theta

    thetaValue.textContent =
        thetaDeg;


    // Mise à jour du cadran

    drawVector(
        thetaDeg
    );


    // Redessiner le graphe

    drawGraph();


    // --------------------------------------------------------
    // POINT MOBILE SUR LA COURBE
    // --------------------------------------------------------

    const rect =
        graphCanvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;


    const left = 65;
    const right = 20;
    const top = 30;
    const bottom = 55;


    const plotWidth =
        width - left - right;

    const plotHeight =
        height - top - bottom;


    const maxI =
        getMaxIntensity() * 1.1;


    const theta =
        thetaDeg * Math.PI / 180;


    const I =
        intensite(theta);


    const x =
        left +
        thetaDeg / 360 *
        plotWidth;


    const y =
        top +
        plotHeight -
        I / maxI *
        plotHeight;


    // --------------------------------------------------------
    // POINT ROUGE
    // --------------------------------------------------------

    graphCtx.fillStyle = "red";

    graphCtx.beginPath();

    graphCtx.arc(
        x,
        y,
        7,
        0,
        2 * Math.PI
    );

    graphCtx.fill();


    // Contour blanc

    graphCtx.strokeStyle =
        "white";

    graphCtx.lineWidth = 2;

    graphCtx.stroke();
}


// ============================================================
// ÉVÉNEMENT DU CURSEUR
// ============================================================

thetaSlider.addEventListener(
    "input",
    update
);


// ============================================================
// REDIMENSIONNEMENT DE LA FENÊTRE
// ============================================================

window.addEventListener(
    "resize",
    resizeAll
);


// ============================================================
// INITIALISATION
// ============================================================

resizeAll();
