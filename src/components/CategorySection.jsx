import React, { useState } from 'react';
import './CategorySection.css';

const CategorySection = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      icon: '📱',
      name: 'Smartphones',
      key: 'Smartphone',
      color: '#FF69B4'
    },
    {
      icon: '📱',
      name: 'Tablets',
      key: 'Tablet',
      color: '#4A90E2'
    },
    {
      icon: '💻',
      name: 'Notebooks',
      key: 'Notebook',
      color: '#32CD32'
    },
    {
      icon: '🖥️',
      name: 'Desktops',
      key: 'Electrónicos',
      color: '#FF6347'
    },
    {
      icon: '🖥️',
      name: 'Monitores',
      key: 'Electrónicos',
      color: '#9370DB'
    },
    {
      icon: '🎧',
      name: 'Acessórios',
      key: 'Electrónicos',
      color: '#FFD700'
    }
  ];

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.key === selectedCategory ? null : category.key);
    }
  };

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">Categorias</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`category-item ${selectedCategory === category.key ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div 
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                <span>{category.icon}</span>
              </div>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;