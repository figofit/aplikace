
// Neurotype questionnaire application JavaScript

// Application data with detailed neurotype information
const neurotypesData = {
  "1A": {
    "name": "Explozivní silový",
    "description": "Preferujete vysokou intenzitu, kratší tréninky a rychlou regeneraci. Zaměřujete se na sílu a výkon s minimální variabilitou.",
    "training": {
      "frequency": "5-7× týdně",
      "intensity": "85-100% 1RM",
      "volume": "3-4 cviky, 2-3 série",
      "rest": "3-4 minuty",
      "methods": "Izometrické přetížení, heavy straight sets, ramping"
    },
    "nutrition": {
      "carbs": "45-55%",
      "protein": "1.8-2.2g/kg",
      "fats": "20-30%",
      "timing": "Sacharidy před a po tréninku, večer bílkoviny + zelenina"
    },
    "exercises": ["Overcoming isometrics", "Heavy partials", "Deadlift holds"],
    "color": "#FF6B6B"
  },
  "1B": {
    "name": "Explozivní rychlostní",
    "description": "Milujete explozivní pohyby, variabilitu a vysokou stimulaci. Potřebujete časté změny a rychlé tempo.",
    "training": {
      "frequency": "5-6× týdně", 
      "intensity": "80-95% explozivně",
      "volume": "5-6 cviků, 2-3 série",
      "rest": "2 minuty",
      "methods": "Plyometrie, cluster série, speed lifting"
    },
    "nutrition": {
      "carbs": "40-50%",
      "protein": "1.8-2.0g/kg",
      "fats": "25-30%",
      "timing": "Vyvážený příjem, více variability v jídelníčku"
    },
    "exercises": ["Plyometric push-ups", "Box jumps", "Olympic lifts"],
    "color": "#4ECDC4"
  },
  "2A": {
    "name": "Variabilní",
    "description": "Potřebujete rozmanitost a dokážete se adaptovat na různé styly. Kombinujete sílu i vytrvalost.",
    "training": {
      "frequency": "4-6× týdně",
      "intensity": "Kombinace neural + muscular",
      "volume": "5-6 cviků, 3-4 série", 
      "rest": "< 2 minuty",
      "methods": "Mix silového a objemového tréninku, supersety"
    },
    "nutrition": {
      "carbs": "40-45%",
      "protein": "1.8-2.0g/kg",
      "fats": "25-30%",
      "timing": "Periodizace podle tréninkových dní"
    },
    "exercises": ["Superseries", "Circuit training", "Combination lifts"],
    "color": "#45B7D1"
  },
  "2B": {
    "name": "Bodybuilding",
    "description": "Zaměřujete se na svalový rozvoj, pumpu a mind-muscle connection. Preferujete kontrolované pohyby.",
    "training": {
      "frequency": "3-6× týdně",
      "intensity": "50-85% 1RM",
      "volume": "5-6+ cviků, 3-6 sérií",
      "rest": "< 2 minuty", 
      "methods": "Drop-sety, pomalé tempo, TUT training"
    },
    "nutrition": {
      "carbs": "35-40%",
      "protein": "2.0-2.2g/kg",
      "fats": "30-35%",
      "timing": "5-6 menších jídel denně, důraz na pocit nasycení"
    },
    "exercises": ["Isolation exercises", "Drop sets", "Slow tempo lifting"],
    "color": "#96CEB4"
  },
  "3": {
    "name": "Strukturální", 
    "description": "Preferujete rutinu, strukturu a vyšší objem tréninku. Potřebujete předvídatelnost a kontrolu.",
    "training": {
      "frequency": "3-4× týdně",
      "intensity": "50-80% 1RM",
      "volume": "3-4 cviky, 3-4 série + warm-up",
      "rest": "3-4 minuty",
      "methods": "Základní cviky, eccentric overload, vysoký objem"
    },
    "nutrition": {
      "carbs": "30-45% (periodizace)",
      "protein": "1.6-1.8g/kg", 
      "fats": "30-40%",
      "timing": "4-6 stabilních jídel, rutina"
    },
    "exercises": ["Basic compound movements", "Eccentric training", "High volume work"],
    "color": "#FECA57"
  }
};

// Questions for neurotype assessment
const sectionBQuestions = [
  "Preferuji krátké, intenzivní tréninky před dlouhými, středně intenzivními",
  "Po tréninku se cítím energizovaný, ne unavený",
  "Mám rád soutěžení a výzvy v tréninku",
  "Rád zkouším nové cviky a tréninkové metody",
  "Preferuji rychlé, explozivní pohyby",
  "Baví mě skupinové tréninky nebo CrossFit",
  "Mám rád kreativitu a variabilitu v tréninku", 
  "Dokážu se adaptovat na různé tréninkové styly",
  "Preferuji vyváženou kombinaci síly a vytrvalosti",
  "Mám rád bodybuilding a svalový rozvoj",
  "Rád se soustředím na pumpu a pocit ze svalů", 
  "Preferuji pomalé, kontrolované pohyby",
  "Mám rád rutinu a opakování stejných cviků",
  "Potřebuji strukturu a předvídatelnost v tréninku",
  "Pracuji nejlépe s vysokým objemem tréninku"
];

// Application state
let currentSection = 0;
const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let formData = {};
let calculatedNeurotype = null;
let neurotypesScores = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateNeurotypeQuestions();
    setupEventListeners();
    tryLoadFromLocalStorage();
    updateNavigationButtons();
});

// Try to load saved data from localStorage
function tryLoadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('neurotype_form_data');
        if (savedData) {
            formData = JSON.parse(savedData);

            // Restore form data if available
            if (formData.currentSection !== undefined) {
                currentSection = parseInt(formData.currentSection);
                delete formData.currentSection;
                showSection(currentSection);
                updateProgress();
            }

            // Restore form values
            Object.keys(formData).forEach(key => {
                const element = document.querySelector(`[name="${key}"]`);
                if (element) {
                    if (element.type === 'radio' || element.type === 'checkbox') {
                        document.querySelectorAll(`[name="${key}"]`).forEach(item => {
                            if (element.type === 'checkbox' && Array.isArray(formData[key])) {
                                if (formData[key].includes(item.value)) {
                                    item.checked = true;
                                }
                            } else if (item.value === formData[key]) {
                                item.checked = true;
                            }
                        });
                    } else {
                        element.value = formData[key];
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('neurotype_form_data');
    }
}

// Save current state to localStorage
function saveToLocalStorage() {
    try {
        const dataToSave = {...formData, currentSection};
        localStorage.setItem('neurotype_form_data', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Generate Section B neurotype questions
function generateNeurotypeQuestions() {
    const container = document.getElementById('neurotype-questions');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    sectionBQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'neurotype-question';

        questionDiv.innerHTML = `
            <p><strong>B${index + 1}.</strong> ${question}</p>
            <div class="likert-scale">
                ${[1, 2, 3, 4, 5].map(value => `
                    <div class="likert-option">
                        <input type="radio" name="B${index + 1}" value="${value}" id="B${index + 1}_${value}" required>
                        <label for="B${index + 1}_${value}">${value}</label>
                    </div>
                `).join('')}
            </div>
            <div class="likert-labels">
                <span>Vůbec nesouhlasím</span>
                <span>Plně souhlasím</span>
            </div>
        `;

        container.appendChild(questionDiv);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Medications radio button change
    document.querySelectorAll('input[name="medications"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const detailsDiv = document.getElementById('medications-details');
            if (detailsDiv) {
                if (this.value === 'yes') {
                    detailsDiv.style.display = 'block';
                } else {
                    detailsDiv.style.display = 'none';
                }
            }
        });
    });
}

// Start questionnaire
function startQuestionnaire() {
    hideAllPages();
    document.getElementById('questionnaire-page').classList.add('active');
    updateProgress();
}

// Navigate to next section
function nextSection() {
    if (validateCurrentSection()) {
        saveCurrentSectionData();

        if (currentSection < sections.length - 1) {
            currentSection++;
            showSection(currentSection);
            updateProgress();
            updateNavigationButtons();
            saveToLocalStorage();
        } else {
            // All sections completed, show loading and calculate results
            showLoading();
            setTimeout(() => {
                calculateAndShowResults();
                // Clear localStorage after completion
                localStorage.removeItem('neurotype_form_data');
            }, 2000);
        }
    }
}

// Navigate to previous section
function previousSection() {
    if (currentSection > 0) {
        saveCurrentSectionData();
        currentSection--;
        showSection(currentSection);
        updateProgress();
        updateNavigationButtons();
        saveToLocalStorage();
    }
}

// Show specific section
function showSection(sectionIndex) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.querySelector(`[data-section="${sections[sectionIndex]}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentSection + 1) / sections.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }

    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% dokončeno`;
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        if (currentSection === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-flex';
        }
    }

    if (nextBtn) {
        if (currentSection === sections.length - 1) {
            nextBtn.textContent = 'Dokončit dotazník';
        } else {
            nextBtn.textContent = 'Další →';
        }
    }
}

// Validate current section
function validateCurrentSection() {
    const currentSectionElement = document.querySelector(`[data-section="${sections[currentSection]}"]`);
    if (!currentSectionElement) return true;

    const requiredFields = currentSectionElement.querySelectorAll('[required]');
    let valid = true;

    // Reset any previous error states
    currentSectionElement.querySelectorAll('.error-message').forEach(el => el.remove());

    for (let field of requiredFields) {
        if (field.type === 'radio') {
            const name = field.name;
            // Skip if we've already checked this radio group
            if (currentSectionElement.querySelector(`.error-message[data-for="${name}"]`)) {
                continue;
            }

            const radioGroup = currentSectionElement.querySelectorAll(`[name="${name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);

            if (!isChecked) {
                valid = false;
                // Find the radio group container to show error near it
                let container = field.closest('.radio-group') || field.closest('.likert-scale');
                if (container) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.setAttribute('data-for', name);
                    errorMsg.textContent = 'Toto pole je povinné';
                    errorMsg.style.color = 'red';
                    errorMsg.style.fontSize = 'small';
                    errorMsg.style.marginTop = '4px';
                    container.appendChild(errorMsg);
                }
            }
        } else if (!field.value.trim()) {
            valid = false;
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Toto pole je povinné';
            errorMsg.style.color = 'red';
            errorMsg.style.fontSize = 'small';
            errorMsg.style.marginTop = '4px';

            const fieldContainer = field.parentNode;
            fieldContainer.appendChild(errorMsg);

            field.style.borderColor = 'red';
            field.focus();
        }
    }

    if (!valid) {
        alert(`Prosím vyplňte všechna povinná pole v sekci ${sections[currentSection]}.`);
    }

    return valid;
}

// Save current section data
function saveCurrentSectionData() {
    const currentSectionElement = document.querySelector(`[data-section="${sections[currentSection]}"]`);
    if (!currentSectionElement) return;

    const formElements = currentSectionElement.querySelectorAll('input, select, textarea');

    formElements.forEach(element => {
        if (element.type === 'radio') {
            if (element.checked) {
                formData[element.name] = element.value;
            }
        } else if (element.type === 'checkbox') {
            if (!formData[element.name]) {
                formData[element.name] = [];
            }

            // Clear previous checkbox values to prevent duplicates
            if (element === currentSectionElement.querySelector(`[name="${element.name}"]`)) {
                formData[element.name] = [];
            }

            if (element.checked) {
                formData[element.name].push(element.value);
            }
        } else {
            formData[element.name] = element.value;
        }
    });
}

// Calculate neurotype based on Section B answers
function calculateNeurotype(answers) {
    // Group questions by neurotype
    const questions = {
        '1A': [1, 2, 3], // Questions 1-3
        '1B': [4, 5, 6], // Questions 4-6
        '2A': [7, 8, 9], // Questions 7-9
        '2B': [10, 11, 12], // Questions 10-12
        '3': [13, 14, 15] // Questions 13-15
    };

    // Calculate scores for each neurotype
    const scores = {};

    Object.keys(questions).forEach(neurotype => {
        const questionIndices = questions[neurotype];
        let total = 0;
        let count = 0;

        questionIndices.forEach(index => {
            const answer = parseInt(answers[`B${index}`]) || 0;
            if (answer > 0) {
                total += answer;
                count++;
            }
        });

        // Calculate average score if there are answers
        scores[neurotype] = count > 0 ? total / count : 0;
    });

    // Store all scores for the radar chart
    neurotypesScores = scores;

    // Find the neurotype with the highest score
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

// Show loading page
function showLoading() {
    hideAllPages();
    document.getElementById('loading-page').classList.add('active');
}

// Create radar chart with neurotype scores
function createNeurotypeChart() {
    const ctx = document.getElementById('neurotypeChart').getContext('2d');

    // Prepare data for the chart
    const data = {
        labels: [
            'Explozivní silový (1A)', 
            'Explozivní rychlostní (1B)', 
            'Variabilní (2A)', 
            'Bodybuilding (2B)', 
            'Strukturální (3)'
        ],
        datasets: [{
            label: 'Vaše neurotypové skóre',
            data: [
                neurotypesScores['1A'] || 0,
                neurotypesScores['1B'] || 0,
                neurotypesScores['2A'] || 0,
                neurotypesScores['2B'] || 0,
                neurotypesScores['3'] || 0
            ],
            fill: true,
            backgroundColor: 'rgba(33, 128, 141, 0.2)',
            borderColor: 'rgb(33, 128, 141)',
            pointBackgroundColor: [
                neurotypesData['1A'].color,
                neurotypesData['1B'].color,
                neurotypesData['2A'].color,
                neurotypesData['2B'].color,
                neurotypesData['3'].color
            ],
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(33, 128, 141)'
        }]
    };

    // Chart configuration
    const config = {
        type: 'radar',
        data: data,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5
                }
            }
        }
    };

    // Create the chart
    new Chart(ctx, config);
}

// Calculate and show results
function calculateAndShowResults() {
    calculatedNeurotype = calculateNeurotype(formData);
    const neurotypeData = neurotypesData[calculatedNeurotype];

    // Create radar chart
    createNeurotypeChart();

    const resultContainer = document.getElementById('neurotype-result');
    if (resultContainer) {
        resultContainer.innerHTML = `
            <div class="neurotype-card" style="border-left-color: ${neurotypeData.color};">
                <h2 class="neurotype-title">Neurotyp ${calculatedNeurotype}: ${neurotypeData.name}</h2>

                <div class="neurotype-section">
                    <h4>📝 Popis</h4>
                    <p>${neurotypeData.description}</p>
                </div>

                <div class="neurotype-section">
                    <h4>🏋️ Doporučený trénink</h4>
                    <ul>
                        <li><strong>Frekvence:</strong> ${neurotypeData.training.frequency}</li>
                        <li><strong>Intenzita:</strong> ${neurotypeData.training.intensity}</li>
                        <li><strong>Objem:</strong> ${neurotypeData.training.volume}</li>
                        <li><strong>Odpočinek:</strong> ${neurotypeData.training.rest}</li>
                        <li><strong>Metody:</strong> ${neurotypeData.training.methods}</li>
                    </ul>
                </div>

                <div class="neurotype-section">
                    <h4>🍎 Výživová doporučení</h4>
                    <ul>
                        <li><strong>Sacharidy:</strong> ${neurotypeData.nutrition.carbs}</li>
                        <li><strong>Bílkoviny:</strong> ${neurotypeData.nutrition.protein}</li>
                        <li><strong>Tuky:</strong> ${neurotypeData.nutrition.fats}</li>
                        <li><strong>Časování:</strong> ${neurotypeData.nutrition.timing}</li>
                    </ul>
                </div>

                <div class="neurotype-section">
                    <h4>💪 Top cviky pro váš typ</h4>
                    <div>
                        ${neurotypeData.exercises.map(exercise => 
                            `<span class="exercise-tag">${exercise}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    hideAllPages();
    document.getElementById('results-page').classList.add('active');
}

// Export results to text format
function exportResults() {
    if (!calculatedNeurotype) return;

    const neurotypeData = neurotypesData[calculatedNeurotype];
    const personalInfo = formData;

    const resultText = `
NEUROTYPOVÝ DOTAZNÍK - VÝSLEDKY
==================================

ZÁKLADNÍ ÚDAJE:
- Věk: ${personalInfo.age || 'Neuvedeno'} let
- Pohlaví: ${personalInfo.gender === 'male' ? 'Muž' : 'Žena'}
- Výška: ${personalInfo.height || 'Neuvedeno'} cm
- Váha: ${personalInfo.weight || 'Neuvedeno'} kg
- Cílová váha: ${personalInfo.targetWeight || 'Neuvedeno'} kg
- Obvod pasu: ${personalInfo.waistCircumference || 'Neuvedeno'} cm

VÁŠ NEUROTYP: ${calculatedNeurotype} - ${neurotypeData.name}
==================================

POPIS:
${neurotypeData.description}

DOPORUČENÝ TRÉNINK:
- Frekvence: ${neurotypeData.training.frequency}
- Intenzita: ${neurotypeData.training.intensity}
- Objem: ${neurotypeData.training.volume}
- Odpočinek: ${neurotypeData.training.rest}
- Metody: ${neurotypeData.training.methods}

VÝŽIVOVÁ DOPORUČENÍ:
- Sacharidy: ${neurotypeData.nutrition.carbs}
- Bílkoviny: ${neurotypeData.nutrition.protein}
- Tuky: ${neurotypeData.nutrition.fats}
- Časování: ${neurotypeData.nutrition.timing}

TOP CVIKY PRO VÁŠ TYP:
${neurotypeData.exercises.join(', ')}

POTŘEBUJETE POMOC S IMPLEMENTACÍ?
==================================
Pokud si nejste jisti interpretací výsledků nebo byste chtěli individuální 
konzultaci k vašemu tréninkovému a výživovému plánu, můžete se na mě obrátit. 
Společně můžeme vyladit váš program podle vašeho neurotypu pro maximální efektivitu.

Jsem k dispozici pro osobní konzultace a dlouhodobou spolupráci při 
dosahování vašich fitness cílů.

==================================
Datum vyhodnocení: ${new Date().toLocaleString('cs-CZ')}
    `;

    // Create and download file
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurotyp_${calculatedNeurotype}_vysledky.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Reset the application to initial state
function startOver() {
    currentSection = 0;
    formData = {};
    calculatedNeurotype = null;

    // Reset form
    const form = document.getElementById('questionnaire-form');
    if (form) {
        form.reset();
    }

    // Hide medication details
    const medicationsDetails = document.getElementById('medications-details');
    if (medicationsDetails) {
        medicationsDetails.style.display = 'none';
    }

    // Clear localStorage
    localStorage.removeItem('neurotype_form_data');

    // Show landing page
    hideAllPages();
    document.getElementById('landing-page').classList.add('active');
}

// Hide all pages
function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}
