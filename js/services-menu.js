(function(){
  'use strict';

  var FALLBACK = {
    services: [
      { text: 'Cloud Implementations', href: 'https://nalsoft.net/services/cloud-implementations/' },
      { text: 'E-Business Implementations', href: 'https://nalsoft.net/services/e-business-implementations/' },
      { text: 'Application Extensions & Customizations', href: 'https://nalsoft.net/services/application-extensions-customizations/' },
      { text: 'Managed Services', href: 'https://nalsoft.net/services/managed-services/' }
    ],
    solutions: [
      { text: 'Oracle ERP Cloud', href: 'https://nalsoft.net/solutions/oracle-erp-cloud/' },
      { text: 'Oracle SCM Cloud', href: 'https://nalsoft.net/solutions/oracle-scm-cloud/' },
      { text: 'Oracle HCM Cloud', href: 'https://nalsoft.net/solutions/oracle-hcm-cloud/' },
      { text: 'Oracle EPM Cloud', href: 'https://nalsoft.net/solutions/oracle-epm-cloud/' },
      { text: 'Oracle Project Management', href: 'https://nalsoft.net/solutions/oracle-project-management/' },
      { text: 'Oracle Logistics Cloud', href: 'https://nalsoft.net/solutions/oracle-logistics-cloud/' },
      { text: 'Oracle Customer Experience (CX)', href: 'https://nalsoft.net/solutions/oracle-customer-experience-cx/' },
      { text: 'Dealer Management System', href: 'https://nalsoft.net/solutions/dealer-management-system/' },
      { text: 'Property Management System', href: 'https://nalsoft.net/solutions/property-management-system/' },
      { text: 'Engineering & Construction System', href: 'https://nalsoft.net/solutions/engineering-construction-system/' },
      { text: 'Time & Attendance System', href: 'https://nalsoft.net/solutions/time-attendance-system/' }
    ],
    industries: [
      { text: 'BFSI', href: 'https://nalsoft.net/industries/bfsi/' },
      { text: 'Engineering & Construction', href: 'https://nalsoft.net/industries/engineering-construction/' },
      { text: 'Manufacturing', href: 'https://nalsoft.net/industries/manufacturing/' },
      { text: 'Real Estate & Property Management', href: 'https://nalsoft.net/industries/real-estate-property-management/' },
      { text: 'Retail & Trading', href: 'https://nalsoft.net/industries/retail-and-trading/' },
      { text: 'Hospitality & Services', href: 'https://nalsoft.net/industries/hospitality-services/' }
    ]
  };

  function appendItems(submenu, items) {
    if (!submenu) return;
    items.forEach(function(item){
      var li = document.createElement('li');
      li.className = 'menu-item';
      var link = document.createElement('a');
      link.href = item.href;
      link.className = 'menu-item-link';
      link.textContent = item.text;
      li.appendChild(link);
      submenu.appendChild(li);
    });
    submenu.dataset.populated = 'true';
  }

  function populateMenu(listSelector, targetSubmenuId, fallbackKey) {
    var submenu = document.getElementById(targetSubmenuId);
    if (!submenu) return;
    if (submenu.dataset.populated === 'true') return;

    // Try fetching from data-website index first
    fetch('data-website/index.html')
      .then(function(res){ return res.text(); })
      .then(function(html){
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var sourceList = doc.querySelector(listSelector);
        if (sourceList) {
          var links = sourceList.querySelectorAll('li > a');
          if (links && links.length) {
            var items = [];
            links.forEach(function(a){
              items.push({ text: (a.textContent || '').trim(), href: a.getAttribute('href') });
            });
            appendItems(submenu, items);
            return;
          }
        }
        // Fallback if no content found
        appendItems(submenu, FALLBACK[fallbackKey] || []);
      })
      .catch(function(){
        // Network or CORS error, fallback
        appendItems(submenu, FALLBACK[fallbackKey] || []);
      });
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Populate dropdowns (with fallback)
    populateMenu('#menu-item-379 > ul.elementskit-dropdown.elementskit-submenu-panel', 'services-submenu', 'services');
    populateMenu('#menu-item-380 > ul.elementskit-dropdown.elementskit-submenu-panel', 'solutions-submenu', 'solutions');
    populateMenu('#menu-item-350 > ul.elementskit-dropdown.elementskit-submenu-panel', 'industries-submenu', 'industries');

    // Accessibility aria-expanded handling on hover/focus for dropdowns
    ['menu-item-services','menu-item-solutions','menu-item-industries'].forEach(function(id){
      var item = document.getElementById(id);
      if (!item) return;
      var trigger = item.querySelector('a.menu-item-link');
      if (!trigger) return;
      item.addEventListener('mouseenter', function(){ trigger.setAttribute('aria-expanded','true'); });
      item.addEventListener('mouseleave', function(){ trigger.setAttribute('aria-expanded','false'); });
      trigger.addEventListener('focus', function(){ trigger.setAttribute('aria-expanded','true'); });
      trigger.addEventListener('blur', function(){ trigger.setAttribute('aria-expanded','false'); });
    });
  });
})();


