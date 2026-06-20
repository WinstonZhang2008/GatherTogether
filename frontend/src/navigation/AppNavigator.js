/**
 * App Navigator - Self-contained JS, HTML layout, and Bottom Navigation styling
 */
const AppNavigator = {
  // 1. Define screens
  screens: {
    HOME: 'screen-home',
    PROFILE: 'screen-profile',
    SETTINGS: 'screen-settings'
  },

  currentScreen: null,

  /**
   * Initializes the app structure, injects CSS, HTML layout, and displays the default screen.
   * @param {string} defaultScreenId 
   */
  init(defaultScreenId) {
    this.injectStyles();
    this.renderAppShell();
    
    this.currentScreen = defaultScreenId;
    this.navigateTo(defaultScreenId);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.screenId) {
        this.render(event.state.screenId);
      }
    });
  },

  /**
   * Injects the required CSS for the bottom navigation directly into the document head
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, sans-serif;
        height: 100vh;
        overflow: hidden;
      }
      .app-shell {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
      }
      .bottom-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #ffffff;
        border-top: 1px solid #e0e0e0;
        height: 65px;
        padding-bottom: env(safe-area-inset-bottom);
      }
      .nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: #666666;
        cursor: pointer;
        transition: color 0.2s ease;
      }
      .nav-item .icon { font-size: 20px; margin-bottom: 4px; }
      .nav-item .label { font-size: 12px; }
      .nav-item.active { color: #007aff; font-weight: 500; }
    `;
    document.head.appendChild(style);
  },

  /**
   * Generates and mounts the core HTML structure inside the <body>
   */
  renderAppShell() {
    const shell = document.createElement('div');
    shell.className = 'app-shell';

    shell.innerHTML = `
      <main id="app-container" class="content-area">
        <section id="screen-home">
          <h1>Welcome Home</h1>
          <p>This is your dynamic home dashboard dashboard.</p>
        </section>

        <section id="screen-profile">
          <h1>Your Profile</h1>
          <p>Manage your user data here.</p>
        </section>

        <section id="screen-settings">
          <h1>Settings</h1>
          <p>Tweak your application preferences.</p>
        </section>
      </main>

      <nav class="bottom-nav">
        <button class="nav-item" data-screen="${this.screens.HOME}">
          <span class="icon">🏠</span>
          <span class="label">Home</span>
        </button>
        <button class="nav-item" data-screen="${this.screens.PROFILE}">
          <span class="icon">👤</span>
          <span class="label">Profile</span>
        </button>
        <button class="nav-item" data-screen="${this.screens.SETTINGS}">
          <span class="icon">⚙️</span>
          <span class="label">Settings</span>
        </button>
      </nav>
    `;

    document.body.appendChild(shell);

    // Attach click event listeners to the tabs dynamically
    shell.querySelectorAll('.nav-item').forEach(button => {
      button.addEventListener('click', () => {
        const targetScreen = button.getAttribute('data-screen');
        this.navigateTo(targetScreen);
      });
    });
  },

  /**
   * Updates state, updates URL history path
   */
  navigateTo(screenId) {
    this.currentScreen = screenId;
    const path = screenId.replace('screen-', '/');
    window.history.pushState({ screenId }, '', path);
    this.render(screenId);
  },

  /**
   * Swaps screens and manages the 'active' tab color states
   */
  render(screenId) {
    // Show/Hide screens
    Object.values(this.screens).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = (id === screenId) ? 'block' : 'none';
      }
    });

    // Toggle active classes on the bottom buttons
    document.querySelectorAll('.nav-item').forEach(button => {
      if (button.getAttribute('data-screen') === screenId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
};

// Auto-run when the script loads, starting on the 'home' screen
AppNavigator.init(AppNavigator.screens.HOME);

export default AppNavigator;