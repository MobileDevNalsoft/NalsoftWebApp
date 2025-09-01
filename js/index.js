(function initPresenceMap() {
  var container = document.getElementById('presence-map');
  if (!container) return;

  // Use Leaflet to avoid geojson loading issues in air-gapped environments
  var map = L.map(container, {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([22.5, 60], 3); // Center around India/GCC

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 6,
    attribution: ''
  }).addTo(map);

  // Enhanced 3D-style icons with animations
  var officeIcon = L.divIcon({
    className: 'office-pin',
    html: '<div style="width:16px;height:16px;background:linear-gradient(135deg, #6c5ce7, #a29bfe);border-radius:50%;box-shadow:0 0 0 12px rgba(108,92,231,0.2), 0 8px 32px rgba(108,92,231,0.3);position:relative;"><div style="position:absolute;top:-4px;left:-4px;width:24px;height:24px;border:2px solid rgba(108,92,231,0.3);border-radius:50%;animation:ripple 2s infinite;"></div></div>',
    iconSize: [16,16],
    iconAnchor: [8,8]
  });
  
  var clientIcon = L.divIcon({
    className: 'client-pin',
    html: '<div style="width:12px;height:12px;background:linear-gradient(135deg, #4dabf7, #74b9ff);border-radius:50%;box-shadow:0 4px 16px rgba(77,171,247,0.4);position:relative;"><div style="position:absolute;top:-2px;left:-2px;width:16px;height:16px;border:1px solid rgba(77,171,247,0.2);border-radius:50%;animation:ripple 3s infinite 1s;"></div></div>',
    iconSize: [12,12],
    iconAnchor: [6,6]
  });

  // Add particle effect background
  addParticleBackground(container);

  // Offices with enhanced tooltips - Updated with precise Nalsoft locations
  // Dubai Headquarters - Business Bay area (25.2048, 55.2708) - Updated to more precise location
  var dubaiMarker = L.marker([25.2048, 55.2708], { icon: officeIcon }).addTo(map);
  dubaiMarker.bindTooltip('<div style="background:linear-gradient(135deg, #6c5ce7, #a29bfe);color:white;padding:8px 12px;border-radius:8px;font-weight:600;box-shadow:0 8px 24px rgba(108,92,231,0.3);">🏢 <strong>Nalsoft Dubai</strong><br><small>Headquarters - Business Bay</small><br><small>25.2048° N, 55.2708° E</small></div>', {className: 'custom-tooltip'});
  
  // Hyderabad Development Center - HITEC City area (17.4485, 78.3824) - Corrected from Bangalore
  var indiaMarker = L.marker([17.4485, 78.3824], { icon: officeIcon }).addTo(map);
  indiaMarker.bindTooltip('<div style="background:linear-gradient(135deg, #6c5ce7, #a29bfe);color:white;padding:8px 12px;border-radius:8px;font-weight:600;box-shadow:0 8px 24px rgba(108,92,231,0.3);">🏢 <strong>Nalsoft Hyderabad</strong><br><small>Development Center - HITEC City</small><br><small>17.4485° N, 78.3824° E</small></div>', {className: 'custom-tooltip'});

  // Clients with staggered animations
  var clients = [
    [24.7136, 46.6753, 'Riyadh', 'Saudi Arabia'],
    [21.4858, 39.1979, 'Jeddah', 'Saudi Arabia'],
    [25.2854, 51.5310, 'Doha', 'Qatar'],
    [29.3759, 47.9783, 'Kuwait City', 'Kuwait'],
    [26.2285, 50.5860, 'Manama', 'Bahrain'],
    [23.5880, 58.4059, 'Muscat', 'Oman'],
    [24.4539, 54.3773, 'Abu Dhabi', 'UAE'],
    [19.0760, 72.8777, 'Mumbai', 'India'],
    [28.6139, 77.2090, 'Delhi', 'India'],
    [13.0827, 80.2707, 'Chennai', 'India'],
    [17.3850, 78.4867, 'Hyderabad', 'India'],
    [18.5204, 73.8567, 'Pune', 'India']
  ];
  
  clients.forEach(function(c, index){
    setTimeout(function(){
      var marker = L.marker([c[0], c[1]], { icon: clientIcon }).addTo(map);
      marker.bindTooltip('<div style="background:linear-gradient(135deg, #4dabf7, #74b9ff);color:white;padding:6px 10px;border-radius:6px;font-weight:500;box-shadow:0 6px 20px rgba(77,171,247,0.3);">🌍 <strong>' + c[2] + '</strong><br><small>' + c[3] + '</small></div>', {className: 'custom-tooltip'});
      
      // Add entrance animation
      marker.getElement().style.opacity = '0';
      marker.getElement().style.transform = 'scale(0.5)';
      setTimeout(function(){
        marker.getElement().style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        marker.getElement().style.opacity = '1';
        marker.getElement().style.transform = 'scale(1)';
      }, 100);
    }, index * 150); // Staggered appearance
  });

  // Add floating connection lines between offices
  setTimeout(function(){
    addConnectionLines(map, [25.2048, 55.2708], [17.4485, 78.3824]);
  }, 2000);

  function addParticleBackground(container) {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    container.appendChild(canvas);
    
    var ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    var particles = [];
    for(var i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
    
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108,92,231,0.1)';
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  function addConnectionLines(map, point1, point2) {
    var latlngs = [
      [point1[0], point1[1]],
      [point2[0], point2[1]]
    ];
    
    var line = L.polyline(latlngs, {
      color: '#6c5ce7',
      weight: 3,
      opacity: 0.6,
      dashArray: '10, 10',
      className: 'connection-line'
    }).addTo(map);
    
    // Animate the line
    var dashOffset = 0;
    setInterval(function(){
      dashOffset = (dashOffset + 1) % 20;
      line.setStyle({dashOffset: dashOffset});
    }, 100);
  }
})();

// Theme brand color toggle: swaps --tekprof-primary-color between #FC5546 and #0F766E
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('themeColorToggle');
  if (!toggle) return;
  var root = document.documentElement;
  var original = getComputedStyle(root).getPropertyValue('--tekprof-primary-color').trim() || '#FC5546';
  var alt = '#0F766E';
  // derive shade values (fallbacks if CSS vars not present)
  var originalShade = 'rgba(252, 85, 70, 0.7)';
  var altShade = 'rgba(15, 118, 110, 0.7)';

  toggle.addEventListener('click', function() {
    var current = getComputedStyle(root).getPropertyValue('--tekprof-primary-color').trim();
    var next = (current.toUpperCase() === original.toUpperCase()) ? alt : original;
    var nextShade = (next === alt) ? altShade : originalShade;
    root.style.setProperty('--tekprof-primary-color', next);
    root.style.setProperty('--tekprof-primary-shade', nextShade);
    toggle.setAttribute('aria-pressed', (next === alt).toString());
  });
});
(()=>{"use strict";const e=window.wp.i18n,t=e=>Math.abs(parseInt(e,10)),a=(e,t,a)=>{const n=new CustomEvent(`wpcf7${t}`,{bubbles:!0,detail:a});"string"==typeof e&&(e=document.querySelector(e)),e.dispatchEvent(n)},n=(e,t)=>{const n=new Map([["init","init"],["validation_failed","invalid"],["acceptance_missing","unaccepted"],["spam","spam"],["aborted","aborted"],["mail_sent","sent"],["mail_failed","failed"],["submitting","submitting"],["resetting","resetting"],["validating","validating"],["payment_required","payment-required"]]);n.has(t)&&(t=n.get(t)),Array.from(n.values()).includes(t)||(t=`custom-${t=(t=t.replace(/[^0-9a-z]+/i," ").trim()).replace(/\s+/,"-")}`);const r=e.getAttribute("data-status");if(e.wpcf7.status=t,e.setAttribute("data-status",t),e.classList.add(t),r&&r!==t){e.classList.remove(r);const t={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,prevStatus:r};a(e,"statuschanged",t)}return t},r=e=>{const{root:t,namespace:a="contact-form-7/v1"}=wpcf7.api;return c.reduceRight(((e,t)=>a=>t(a,e)),(e=>{let n,r,{url:c,path:o,endpoint:s,headers:i,body:l,data:p,...d}=e;"string"==typeof s&&(n=a.replace(/^\/|\/$/g,""),r=s.replace(/^\//,""),o=r?n+"/"+r:n),"string"==typeof o&&(-1!==t.indexOf("?")&&(o=o.replace("?","&")),o=o.replace(/^\//,""),c=t+o),i={Accept:"application/json, */*;q=0.1",...i},delete i["X-WP-Nonce"],p&&(l=JSON.stringify(p),i["Content-Type"]="application/json");const f={code:"fetch_error",message:"You are probably offline."},u={code:"invalid_json",message:"The response is not a valid JSON response."};return window.fetch(c||o||window.location.href,{...d,headers:i,body:l}).then((e=>Promise.resolve(e).then((e=>{if(e.status>=200&&e.status<300)return e;throw e})).then((e=>{if(204===e.status)return null;if(e&&e.json)return e.json().catch((()=>{throw u}));throw u}))),(()=>{throw f}))}))(e)},c=[];function o(e,t={}){const{target:a,scope:r=e,...c}=t;if(void 0===e.wpcf7?.schema)return;const o={...e.wpcf7.schema};if(void 0!==a){if(!e.contains(a))return;if(!a.closest(".wpcf7-form-control-wrap[data-name]"))return;if(a.closest(".novalidate"))return}const p=r.querySelectorAll(".wpcf7-form-control-wrap"),d=Array.from(p).reduce(((e,t)=>(t.closest(".novalidate")||t.querySelectorAll(":where( input, textarea, select ):enabled").forEach((t=>{if(t.name)switch(t.type){case"button":case"image":case"reset":case"submit":break;case"checkbox":case"radio":t.checked&&e.append(t.name,t.value);break;case"select-multiple":for(const a of t.selectedOptions)e.append(t.name,a.value);break;case"file":for(const a of t.files)e.append(t.name,a);break;default:e.append(t.name,t.value)}})),e)),new FormData),f=e.getAttribute("data-status");Promise.resolve(n(e,"validating")).then((n=>{if(void 0!==swv){const n=swv.validate(o,d,t);for(const t of p){if(void 0===t.dataset.name)continue;const c=t.dataset.name;if(n.has(c)){const{error:t,validInputs:a}=n.get(c);i(e,c),void 0!==t&&s(e,c,t,{scope:r}),l(e,c,null!=a?a:[])}if(t.contains(a))break}}})).finally((()=>{n(e,f)}))}r.use=e=>{c.unshift(e)};const s=(e,t,a,n)=>{const{scope:r=e,...c}=null!=n?n:{},o=`${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi,""),s=e.querySelector(`.wpcf7-form-control-wrap[data-name="${t}"] .wpcf7-form-control`);(()=>{const t=document.createElement("li");t.setAttribute("id",o),s&&s.id?t.insertAdjacentHTML("beforeend",`<a href="#${s.id}">${a}</a>`):t.insertAdjacentText("beforeend",a),e.wpcf7.parent.querySelector(".screen-reader-response ul").appendChild(t)})(),r.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`).forEach((e=>{const t=document.createElement("span");t.classList.add("wpcf7-not-valid-tip"),t.setAttribute("aria-hidden","true"),t.insertAdjacentText("beforeend",a),e.appendChild(t),e.querySelectorAll("[aria-invalid]").forEach((e=>{e.setAttribute("aria-invalid","true")})),e.querySelectorAll(".wpcf7-form-control").forEach((e=>{e.classList.add("wpcf7-not-valid"),e.setAttribute("aria-describedby",o),"function"==typeof e.setCustomValidity&&e.setCustomValidity(a),e.closest(".use-floating-validation-tip")&&(e.addEventListener("focus",(e=>{t.setAttribute("style","display: none")})),t.addEventListener("click",(e=>{t.setAttribute("style","display: none")})))}))}))},i=(e,t)=>{const a=`${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi,"");e.wpcf7.parent.querySelector(`.screen-reader-response ul li#${a}`)?.remove(),e.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`).forEach((e=>{e.querySelector(".wpcf7-not-valid-tip")?.remove(),e.querySelectorAll("[aria-invalid]").forEach((e=>{e.setAttribute("aria-invalid","false")})),e.querySelectorAll(".wpcf7-form-control").forEach((e=>{e.removeAttribute("aria-describedby"),e.classList.remove("wpcf7-not-valid"),"function"==typeof e.setCustomValidity&&e.setCustomValidity("")}))}))},l=(e,t,a)=>{e.querySelectorAll(`[data-reflection-of="${t}"]`).forEach((e=>{if("output"===e.tagName.toLowerCase()){const t=e;0===a.length&&a.push(t.dataset.default),a.slice(0,1).forEach((e=>{e instanceof File&&(e=e.name),t.textContent=e}))}else e.querySelectorAll("output").forEach((e=>{e.hasAttribute("data-default")?0===a.length?e.removeAttribute("hidden"):e.setAttribute("hidden","hidden"):e.remove()})),a.forEach((a=>{a instanceof File&&(a=a.name);const n=document.createElement("output");n.setAttribute("name",t),n.textContent=a,e.appendChild(n)}))}))};function p(e,t={}){if(wpcf7.blocked)return d(e),void n(e,"submitting");const c=new FormData(e);t.submitter&&t.submitter.name&&c.append(t.submitter.name,t.submitter.value);const o={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,inputs:Array.from(c,(e=>{const t=e[0],a=e[1];return!t.match(/^_/)&&{name:t,value:a}})).filter((e=>!1!==e)),formData:c};r({endpoint:`contact-forms/${e.wpcf7.id}/feedback`,method:"POST",body:c,wpcf7:{endpoint:"feedback",form:e,detail:o}}).then((t=>{const r=n(e,t.status);return o.status=t.status,o.apiResponse=t,["invalid","unaccepted","spam","aborted"].includes(r)?a(e,r,o):["sent","failed"].includes(r)&&a(e,`mail${r}`,o),a(e,"submit",o),t})).then((t=>{t.posted_data_hash&&(e.querySelector('input[name="_wpcf7_posted_data_hash"]').value=t.posted_data_hash),"mail_sent"===t.status&&(e.reset(),e.wpcf7.resetOnMailSent=!0),t.invalid_fields&&t.invalid_fields.forEach((t=>{s(e,t.field,t.message)})),e.wpcf7.parent.querySelector('.screen-reader-response [role="status"]').insertAdjacentText("beforeend",t.message),e.querySelectorAll(".wpcf7-response-output").forEach((e=>{e.innerText=t.message}))})).catch((e=>console.error(e)))}r.use(((e,t)=>{if(e.wpcf7&&"feedback"===e.wpcf7.endpoint){const{form:t,detail:r}=e.wpcf7;d(t),a(t,"beforesubmit",r),n(t,"submitting")}return t(e)}));const d=e=>{e.querySelectorAll(".wpcf7-form-control-wrap").forEach((t=>{t.dataset.name&&i(e,t.dataset.name)})),e.wpcf7.parent.querySelector('.screen-reader-response [role="status"]').innerText="",e.querySelectorAll(".wpcf7-response-output").forEach((e=>{e.innerText=""}))};function f(e){const t=new FormData(e),c={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,inputs:Array.from(t,(e=>{const t=e[0],a=e[1];return!t.match(/^_/)&&{name:t,value:a}})).filter((e=>!1!==e)),formData:t};r({endpoint:`contact-forms/${e.wpcf7.id}/refill`,method:"GET",wpcf7:{endpoint:"refill",form:e,detail:c}}).then((t=>{e.wpcf7.resetOnMailSent?(delete e.wpcf7.resetOnMailSent,n(e,"mail_sent")):n(e,"init"),c.apiResponse=t,a(e,"reset",c)})).catch((e=>console.error(e)))}r.use(((e,t)=>{if(e.wpcf7&&"refill"===e.wpcf7.endpoint){const{form:t,detail:a}=e.wpcf7;d(t),n(t,"resetting")}return t(e)}));const u=(e,t)=>{for(const a in t){const n=t[a];e.querySelectorAll(`input[name="${a}"]`).forEach((e=>{e.value=""})),e.querySelectorAll(`img.wpcf7-captcha-${a.replaceAll(":","")}`).forEach((e=>{e.setAttribute("src",n)}));const r=/([0-9]+)\.(png|gif|jpeg)$/.exec(n);r&&e.querySelectorAll(`input[name="_wpcf7_captcha_challenge_${a}"]`).forEach((e=>{e.value=r[1]}))}},m=(e,t)=>{for(const a in t){const n=t[a][0],r=t[a][1];e.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${a}"]`).forEach((e=>{e.querySelector(`input[name="${a}"]`).value="",e.querySelector(".wpcf7-quiz-label").textContent=n,e.querySelector(`input[name="_wpcf7_quiz_answer_${a}"]`).value=r}))}};function w(e){const a=new FormData(e);e.wpcf7={id:t(a.get("_wpcf7")),status:e.getAttribute("data-status"),pluginVersion:a.get("_wpcf7_version"),locale:a.get("_wpcf7_locale"),unitTag:a.get("_wpcf7_unit_tag"),containerPost:t(a.get("_wpcf7_container_post")),parent:e.closest(".wpcf7"),get schema(){return wpcf7.schemas.get(this.id)}},wpcf7.schemas.set(e.wpcf7.id,void 0),e.querySelectorAll(".has-spinner").forEach((e=>{e.insertAdjacentHTML("afterend",'<span class="wpcf7-spinner"></span>')})),(e=>{e.querySelectorAll(".wpcf7-exclusive-checkbox").forEach((t=>{t.addEventListener("change",(t=>{const a=t.target.getAttribute("name");e.querySelectorAll(`input[type="checkbox"][name="${a}"]`).forEach((e=>{e!==t.target&&(e.checked=!1)}))}))}))})(e),(e=>{e.querySelectorAll(".has-free-text").forEach((t=>{const a=t.querySelector("input.wpcf7-free-text"),n=t.querySelector('input[type="checkbox"], input[type="radio"]');a.disabled=!n.checked,e.addEventListener("change",(e=>{a.disabled=!n.checked,e.target===n&&n.checked&&a.focus()}))}))})(e),(e=>{e.querySelectorAll(".wpcf7-validates-as-url").forEach((e=>{e.addEventListener("change",(t=>{let a=e.value.trim();a&&!a.match(/^[a-z][a-z0-9.+-]*:/i)&&-1!==a.indexOf(".")&&(a=a.replace(/^\/+/,""),a="http://"+a),e.value=a}))}))})(e),(e=>{if(!e.querySelector(".wpcf7-acceptance")||e.classList.contains("wpcf7-acceptance-as-validation"))return;const t=()=>{let t=!0;e.querySelectorAll(".wpcf7-acceptance").forEach((e=>{if(!t||e.classList.contains("optional"))return;const a=e.querySelector('input[type="checkbox"]');(e.classList.contains("invert")&&a.checked||!e.classList.contains("invert")&&!a.checked)&&(t=!1)})),e.querySelectorAll(".wpcf7-submit").forEach((e=>{e.disabled=!t}))};t(),e.addEventListener("change",(e=>{t()})),e.addEventListener("wpcf7reset",(e=>{t()}))})(e),(e=>{const a=(e,a)=>{const n=t(e.getAttribute("data-starting-value")),r=t(e.getAttribute("data-maximum-value")),c=t(e.getAttribute("data-minimum-value")),o=e.classList.contains("down")?n-a.value.trim().length:a.value.trim().length;e.setAttribute("data-current-value",o),e.innerText=o,r&&r<a.value.length?e.classList.add("too-long"):e.classList.remove("too-long"),c&&a.value.length<c?e.classList.add("too-short"):e.classList.remove("too-short")},n=t=>{t={init:!1,...t},e.querySelectorAll(".wpcf7-character-count").forEach((n=>{const r=n.getAttribute("data-target-name"),c=e.querySelector(`[name="${r}"]`);c&&(c.value=c.defaultValue,a(n,c),t.init&&c.addEventListener("keyup",(e=>{a(n,c)})))}))};n({init:!0}),e.addEventListener("wpcf7reset",(e=>{n()}))})(e),window.addEventListener("load",(t=>{wpcf7.cached&&e.reset()})),e.addEventListener("reset",(t=>{wpcf7.reset(e)})),e.addEventListener("submit",(t=>{wpcf7.submit(e,{submitter:t.submitter}),t.preventDefault()})),e.addEventListener("wpcf7submit",(t=>{t.detail.apiResponse.captcha&&u(e,t.detail.apiResponse.captcha),t.detail.apiResponse.quiz&&m(e,t.detail.apiResponse.quiz)})),e.addEventListener("wpcf7reset",(t=>{t.detail.apiResponse.captcha&&u(e,t.detail.apiResponse.captcha),t.detail.apiResponse.quiz&&m(e,t.detail.apiResponse.quiz)})),e.addEventListener("change",(t=>{t.target.closest(".wpcf7-form-control")&&wpcf7.validate(e,{target:t.target})})),e.addEventListener("wpcf7statuschanged",(t=>{const a=t.detail.status;e.querySelectorAll(".active-on-any").forEach((e=>{e.removeAttribute("inert"),e.classList.remove("active-on-any")})),e.querySelectorAll(`.inert-on-${a}`).forEach((e=>{e.setAttribute("inert","inert"),e.classList.add("active-on-any")}))}))}document.addEventListener("DOMContentLoaded",(t=>{var a;if("undefined"!=typeof wpcf7)if(void 0!==wpcf7.api)if("function"==typeof window.fetch)if("function"==typeof window.FormData)if("function"==typeof NodeList.prototype.forEach)if("function"==typeof String.prototype.replaceAll){wpcf7={init:w,submit:p,reset:f,validate:o,schemas:new Map,...null!==(a=wpcf7)&&void 0!==a?a:{}},document.querySelectorAll("form .wpcf7[data-wpcf7-id]").forEach((t=>{const a=document.createElement("p");a.setAttribute("class","wpcf7-form-in-wrong-place");const n=document.createElement("strong");n.append((0,e.__)("Error:","contact-form-7"));const r=(0,e.__)("This contact form is placed in the wrong place.","contact-form-7");a.append(n," ",r),t.replaceWith(a)})),document.querySelectorAll(".wpcf7 > form").forEach((e=>{wpcf7.init(e),e.closest(".wpcf7").classList.replace("no-js","js")}));for(const e of wpcf7.schemas.keys())r({endpoint:`contact-forms/${e}/feedback/schema`,method:"GET"}).then((t=>{wpcf7.schemas.set(e,t)}))}else console.error("Your browser does not support String.replaceAll().");else console.error("Your browser does not support NodeList.forEach().");else console.error("Your browser does not support window.FormData().");else console.error("Your browser does not support window.fetch().");else console.error("wpcf7.api is not defined.");else console.error("wpcf7 is not defined.")}))})();