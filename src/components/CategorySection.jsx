import React, { useState } from 'react';
import './CategorySection.css';

const CategorySection = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      icon: '/picture/Smartphones.png',
      name: 'Smartphones',
      key: 'Smartphones',
      color: '#FF69B4'
    },
    {
      icon: '/picture/Tablets.png',
      name: 'Tablets',
      key: 'Tablets',
      color: '#4A90E2'
    },
    {
      icon: '/picture/Notebooks.png',
      name: 'Notebooks',
      key: 'Notebooks',
      color: '#32CD32'
    },
    {
      icon: '/picture/Desktops.png',
      name: 'Desktops',
      key: 'Desktops',
      color: '#FF6347'
    },
    {
      icon: '/picture/Monitores.png',
      name: 'Monitores',
      key: 'Monitores',
      color: '#9370DB'
    },
    {
      icon: '/picture/Acessorios.png',
      name: 'Acessórios',
      key: 'Acessórios',
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
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`category-item ${selectedCategory === category.key ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-icon">
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  className="category-icon-img"
                />
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