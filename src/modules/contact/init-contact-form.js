import { ClientValidator } from './client-validation'

$(window).on('load', function () {

    const contactModal = $('#contact-modal')
    const contactForm = $('#contact-form')
    const inputFields = $(contactForm).find('input, textarea')
    const submitButton = $(contactForm).find("button[type=submit]")

    const progressCaption = $(submitButton).find('#mail-progress-caption')
    const progressBar = $(submitButton).find('#mail-progress-bar')

    // if leaving contact section hide contact modal immediately
    emitter.on('leaving-contact-section', function () {
        hideModal()
    })

    // on camera facing front wall - initialize the reactive form observables (validators)
    emitter.on('camera-facing-changed', function () {
        if (cubeState.get('cameraFacing') == 'outside-the-box') {
            revealModal()
            setTimeout(function () {
                // initialize form field observables
                ClientValidator.initFieldsObservers([...contactForm[0].querySelectorAll('input, textarea')], contactForm[0])
            }, 0);
        } else {
            resetForm()
            ClientValidator.unsubscribeFieldObservers()
        }
    })

    contactForm.on('submit', function (e) {
        e.preventDefault()
        let mailData = {}
        inputFields.each((i, field) => mailData[$(field).attr('name')] = $(field).val())

        revealProgress()
        lockForm()

        $.ajax({
            method: 'POST',
            url: '/contactMessage',
            data: mailData,
        })
            .then((res) => {
                completeProgressAndResetForm(true)
                unlockForm()
            })
            .catch((res) => {
                hideProgress('failed')
                unlockForm()
                logError(res)
            });

        return false
    })


    function revealModal() {
        if (contactModal.hasClass('hidden-contact-modal')) {
            contactModal.removeClass('hidden-contact-modal')
        }
    }

    function hideModal() {
        if (!contactModal.hasClass('hidden-contact-modal')) {
            contactModal.addClass('hidden-contact-modal')
        }
    }

    function revealProgress() {
        submitButton.addClass('delivering')
        progressCaption.html('Delivering...')
    }

    function completeProgressAndResetForm(resetFieldObservers) {
        progressBar.css('width', '100%')
        setTimeout(function () {
            progressCaption.html('Email sent!')
            hideProgress()
            resetForm()
            if (resetFieldObservers) {
                ClientValidator.initFieldsObservers([...contactForm[0].querySelectorAll('input, textarea')], contactForm[0])
            }
        }, 750);
    }

    function hideProgress(status) {
        if (status && status == 'failed') {
            progressBar.css('background', 'red')
            progressCaption.html('Delivery failed')
        }
        setTimeout(function () {
            progressBar.css('background', '')
            progressBar.css('width', '')
            progressCaption.html('')
            submitButton.removeClass('delivering')
            submitButton.blur()
        }, 3000)
    }

    function resetForm() {
        contactForm[0].reset()
    }

    function lockForm() {
        contactForm.css('pointer-events', 'none')
    }

    function unlockForm() {
        contactForm.css('pointer-events', '')
    }

    function logError(err) {
        let msg = err.message || err.responseJSON.message || err
        console.log('status:', msg)
        console.log('error data:', err)
    }
})