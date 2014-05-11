(function () {

  var Composer = UX.View.Composer = Backbone.View.extend({

    initialize: function (options) {
      this.user = options.user;
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
    }

  });

}).call(this);

