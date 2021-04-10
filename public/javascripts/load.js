(function ($) {
  $('.card').each(function() {
    var $this = $(this),
        $inner = $('.inner', $this),
        cardHeight = $this.height(),
        innerHeight = $inner.height();

    if (innerHeight > cardHeight) {
      $('.text', $this).css('font-size', '11px');
    }
  });
}(jQuery));