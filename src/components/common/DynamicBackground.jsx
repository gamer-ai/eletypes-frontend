import React from "react";
import { Opulento, Lumiflex, Tranquiluxe, Novatrix, Velustro, Zenitho} from "uvcanvas";

const DynamicBackground = ({ theme }) => {

    if (theme.label === "Tranquiluxe" ){
        return       <Tranquiluxe className="dynamicBackground"/>
    }
    if (theme.label === "Lumiflex" ){
        return       <Lumiflex className="dynamicBackground"/>
    }
    if (theme.label === "Opulento" ){
        return       <Opulento className="dynamicBackground"/>
    }
    if (theme.label === "Novatrix" ){
        return       <Novatrix className="dynamicBackground"/>
    }
    if (theme.label === "Velustro" ){
        return       <Velustro className="dynamicBackground"/>
    }
    if (theme.label === "Zenitho" ){
        return       <Zenitho className="dynamicBackground"/>
    }
    return null;
};

export default DynamicBackground;
