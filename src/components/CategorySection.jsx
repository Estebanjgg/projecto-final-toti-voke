import React, { useState } from 'react';
import './CategorySection.css';

const CategorySection = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      icon: '/picture/Smartphones.png',
      name: 'Smartphones',
      key: 'Smartphone',
      color: '#FF69B4'
    },
    {
      icon: '/picture/Tablets.png',
      name: 'Tablets',
      key: 'Tablet',
      color: '#4A90E2'
    },
    {
      icon: '/picture/Notebooks.png',
      name: 'Notebooks',
      key: 'Notebook',
      color: '#32CD32'
    },
    {
      icon: '/picture/Desktops.png',
      name: 'Desktops',
      key: 'Electrónicos',
      color: '#FF6347'
    },
    {
      icon: '/picture/Monitores.png',
      name: 'Monitores',
      key: 'Electrónicos',
      color: '#9370DB'
    },
    {
      icon: '/picture/Acessorios.png',
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
                <img src={category.icon} alt={category.name} className="category-icon-img" />
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