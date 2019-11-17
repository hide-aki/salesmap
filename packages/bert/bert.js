class BertAlert {
  constructor() {
    this.styles = [
      'fixed-top',
      'fixed-bottom',
      'growl-top-left',
      'growl-top-right',
      'growl-bottom-left',
      'growl-bottom-right'
    ];

    this.types = [
      'default',
      'success',
      'info',
      'warning',
      'danger'
    ];

    this.icons = {
      default: 'fas fa-bell',
      success: 'fas fa-check',
      info: 'fas fa-info',
      warning: 'fas fa-exclamation-triangle',
      danger: 'fas fa-times'
    };

    this.defaults = {
      hideDelay: {
        default: 1000,
        success: 1000,
        info: 3500,
        warning: 3500,
        danger: 10000,
      },
      style: 'fixed-top',
      type: 'default'
    };
  }

  alert() {
    if ( this.isVisible() ) {
      this.hide();
      setTimeout( () => { this.handleAlert( arguments ); }, 300 );
    } else {
      this.handleAlert( arguments );
    }
  }

  isVisible() {
    return $( '.bert-alert' ).hasClass( 'show' );
  }

  handleAlert( alert ) {
    this.registerClickHandler();
    this.setBertOnSession( alert );
    setTimeout( () => { this.show(); }, 20 );
    this.bertTimer(alert);
  }

  registerClickHandler() {
    $( '.bert-alert' ).off( 'click' );
    $( '.bert-alert' ).on( 'click', () => { this.hide(); } );
  }

  bertTimer(alert) {
    let type = alert[0].type || this.defaults.type;

    clearTimeout( this.timer );
    this.timer = setTimeout( () => { this.hide(); }, this.defaults.hideDelay[type] );
    return this.timer;
  }

  show() {
    $( '.bert-alert' ).addClass( 'show' ).delay( 25 ).queue( () => {
      $( '.bert-alert' ).addClass( 'animate' ).dequeue();
    });
  }

  hide() {
    $( '.bert-alert' ).removeClass( 'animate' );
    setTimeout( () => {
      $( '.bert-alert' ).removeClass( 'show' );
      Session.set( 'bertAlert', null );
    }, 300 );
  }

  setBertOnSession( alert ) {
    if ( typeof alert[0] === 'object' ) {
      let type = alert[0].type || this.defaults.type;

      Session.set( 'bertAlert', {
        title: alert[0].title || "",
        message: alert[0].message || "",
        type: type,
        style: alert[0].style || this.defaults.style,
        icon: alert[0].icon || this.icons[ type ]
      });
    } else {
      let type = alert[1] || this.defaults.type;

      Session.set( 'bertAlert', {
        message: alert[0] || "",
        type: type,
        style: alert[2] || this.defaults.style,
        icon: alert[3] || this.icons[ type ]
      });
    }
  }
}

Bert = new BertAlert();