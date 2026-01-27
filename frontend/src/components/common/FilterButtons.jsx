import React from 'react';

/**
 * Componente reutilizable de botones de filtro
 * Sigue SRP y OCP: fácil de extender sin modificar
 * 
 * @param {Array} filters - Array de objetos {id, label, icon}
 * @param {string} selected - ID del filtro seleccionado
 * @param {function} onSelect - Callback al seleccionar
 * @param {string} colorScheme - Esquema de colores (blue, green, indigo)
 */
const FilterButtons = ({ filters, selected, onSelect, colorScheme = 'blue' }) => {
    const getColorClasses = (isSelected) => {
        const schemes = {
            blue: isSelected
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            green: isSelected
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            indigo: isSelected
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        };

        return schemes[colorScheme] || schemes.blue;
    };

    return (
        <div className="space-y-2">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onSelect(filter.id)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium transition ${getColorClasses(selected === filter.id)}`}
                >
                    {filter.icon && <span className="mr-2">{filter.icon}</span>}
                    {filter.label}
                    {filter.count !== undefined && ` (${filter.count})`}
                </button>
            ))}
        </div>
    );
};

export default FilterButtons;
