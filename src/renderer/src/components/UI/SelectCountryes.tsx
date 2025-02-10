/* eslint-disable prettier/prettier */
import { useState } from 'react';

type propsType = {
    setCountry: (e: string) => void
}

const CountrySelector = (props: propsType): JSX.Element => {
    const [selectedCountry, setSelectedCountry] = useState('');

    const countries = [
        "Canada", "china", "colombia", "Republica dominicana", "Ecuador", "Japon", "Europa", "Estados unidos",
        "Puerto rico", "Aruba", "Reino unido", "chile", "Costa rica", "Guatemala", "Honduras", "panama",
        "Emiratos arabes", "Argentina", "Union Europea", "Corea", "Rusia"
    ];


    const handleCountryChange = (event): void => {
        setSelectedCountry(event.target.value);
        props.setCountry(event.target.value)
    };

    return (
        <div>
            <select className='defaultSelect' id="country" value={selectedCountry} onChange={handleCountryChange}>
                <option value="">--Seleccione un país--</option>
                {countries.map((country, index) => (
                    <option key={index} value={country}>
                        {country}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CountrySelector;
