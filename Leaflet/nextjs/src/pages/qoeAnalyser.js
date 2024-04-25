export function analyseQoE(type, valeurQoE, seuilFixe) {
    let verdict, marge;

    // Convertir la valeur de QoE en pourcentage si nécessaire
    if (valeurQoE <= 1) {
        valeurQoE *= 100;
    }

    // Comparer la valeur de QoE avec le seuil fixé
    if (valeurQoE >= seuilFixe) {
        verdict = `La QoE ${type} est de ${valeurQoE.toFixed(3)}%, elle est au-dessus du seuil de qualité, ce qui est positif.`;
        marge = " Pas de marge d'amélioration nécessaire.";
    } else {
        // Ajouter des cas spécifiques pour chaque type de QoE
        switch (type) {
            case "sms":
                verdict = `La QoE ${type} est de ${valeurQoE.toFixed(3)}%, soit ${Math.floor(valeurQoE * 100)} ${type.toUpperCase()} sur 10000 ont été envoyés et reçus avec succès.`;
                break;
            case "voix":
                verdict = `La QoE ${type} est de ${valeurQoE.toFixed(3)}%, ce qui indique que ${Math.floor(valeurQoE * 100)} appels sur 10000 sont en succès (en émission et en réception).`;
                break;
            case "data":
                verdict = `La QoE ${type} est de ${valeurQoE.toFixed(3)}%, ce qui indique que ${Math.floor(valeurQoE * 100)} sessions TCP sur 10000 sont en succès.`;
                break;
            default:
                verdict = `La QoE ${type} est de ${valeurQoE.toFixed(3)}%.`;
        }
        marge = ` Il y a une marge d'amélioration pour atteindre l'objectif de ${seuilFixe}%.`;
    }

    return {
        verdict: verdict + marge
    };
}
