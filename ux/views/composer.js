(function () {

  var Composer = UX.View.Composer = Backbone.View.extend({

    events: {
      'submit form': 'submit'
    },

    initialize: function (options) {
      this.user = options.user;
      this.epitaphs = options.epitaphs;
    },

    render: function () {
      this.$el.html(Tmpl.composer({
        user: this.user
      }));

      return this;
    },

    show: function () {
      this.$el.hide();
      $(document.body).append(this.$el);
      this.$el.show();
    },

    disable: function () {
      this._disabled = true;
      this.$el.find('form').prop('disabled', true);
    },

    enable: function () {
      this._disabled = false;
      this.$el.find('form').prop('disabled', false);
    },

    submit: function (event) {
      var form = event.target;
      var self = this;

      event.preventDefault();

      this.disable();

      this.epitaph = new UX.Model.Epitaph({
        text: form.text.value,
        user_id: this.user.id
      });

      this.epitaphs.add(this.epitaph);

      this.epitaph.save({}, {
        complete: function () {
          self.enable();
        },
        success: function () {
          //self.hide();
        }
      });
    }

  });

}).call(this);

