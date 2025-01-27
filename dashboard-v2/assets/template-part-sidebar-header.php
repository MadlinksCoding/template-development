<?php
/**
 * Template part: Example
 *
 * These parameters are declared before calling the template:
 * @param string $fansocial_role The role associated with the social fan.
 * @param int    $user_id        The ID of the user.
 */
?>

<!-- Section outer wrapper -->
<section class="unq_lwRah YEFiA gsCWf zaSgn KIZab">

	<!-- Inner container -->
	<div class="eLfwd uOVQT">

		<!-- sidebar-header-wrapper -->
		<div class="flex flex-column gap8">
			<!-- nav -->
			<div class="elm_xtJfnQ flex justify-between items-center pt3 pl3 pr3">
				<!-- logo-container -->
				<a href="<?php echo home_url(); ?>" class="elm_qsbynB">
					<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'logo_bg', false, 'common_elm_wvkNnj, w40, h40'); ?>
				</a>

				<!-- nav-right (glove) -->
				<div class="elm_UJbtMS flex justify-center items-center">
					<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'bell', false, 'common_elm_GRbGNf, w30, h30'); ?>
					<div class="target-id absolute bottom-0 right-0">
						<div class="target-id-button" data-target="menu-1">
							<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'globe', false, 'common_elm_GRbGNf, w30, h30'); ?>
						</div>
						<div class="menu-id" data-menu="menu-1">
							<div class="form-field">
								<form method="post">
									<label for="user_language">Select your language</label>
									<select name="user_language" id="user_language" required="" aria-required="true" aria-label="language" aria-describedby="user_language-description" onchange="this.form.submit()">
										<option value="en|en_US">English (English)</option>
										<option value="zh|zh_CN">Chinese (Simplified) (中文)</option>
										<option value="zh-TW|zh_TW">Chinese (Traditional) (中文繁體)</option>
										<option value="ja|ja">Japanese (日本語)</option>
										<option value="ko|ko_KR">Korean (한국어)</option>
										<option value="af|af">Afrikaans (Afrikaans)</option>
										<option value="sq|sq">Albanian (Shqip)</option>
										<option value="am|am">Amharic (አማርኛ)</option>
										<option value="ar|ar">Arabic (العربية)</option>
										<option value="hy|hy">Armenian (Հայերեն)</option>
										<option value="az|az">Azerbaijani (Azərbaycanca)</option>
										<option value="bn|bn_BD">Bengali (বাংলা)</option>
										<option value="bs|bs_BA">Bosnian (Bosanski)</option>
										<option value="bg|bg_BG">Bulgarian (Български)</option>
										<option value="ca|ca">Catalan (Català)</option>
										<option value="hr|hr">Croatian (Hrvatski)</option>
										<option value="cs|cs_CZ">Czech (Čeština)</option>
										<option value="da|da_DK">Danish (Dansk)</option>
										<option value="fa-AF|fa_AF">Dari (دری)</option>
										<option value="nl|nl_NL">Dutch (Nederlands)</option>
										<option value="et|et">Estonian (Eesti)</option>
										<option value="fa|fa">Farsi (Persian) (فارسی)</option>
										<option value="tl|tl">Filipino, Tagalog (Tagalog)</option>
										<option value="fi|fi">Finnish (Suomi)</option>
										<option value="fr|fr">French (Français)</option>
										<option value="fr-CA|fr_CA">French (Canada) (Français canadien)</option>
										<option value="ka|ka">Georgian (ქართული)</option>
										<option value="de|de_DE">German (Deutsch)</option>
										<option value="el|el">Greek (Ελληνικά)</option>
										<option value="gu|gu_IN">Gujarati (ગુજરાતી)</option>
										<option value="ht|ht">Haitian Creole (Kreyòl ayisyen)</option>
										<option value="ha|ha">Hausa (هَوُسَ)</option>
										<option value="he|he_IL">Hebrew (עִבְרִית)</option>
										<option value="hi|hi_IN">Hindi (हिन्दी)</option>
										<option value="hu|hu_HU">Hungarian (Magyar)</option>
										<option value="is|is_IS">Icelandic (Íslenska)</option>
										<option value="id|id_ID">Indonesian (Bahasa Indonesia)</option>
										<option value="ga|ga">Irish (Gaeilge)</option>
										<option value="it|it_IT">Italian (Italiano)</option>
										<option value="kn|kn">Kannada (ಕನ್ನಡ)</option>
										<option value="kk|kk">Kazakh (Қазақ)</option>
										<option value="lv|lv">Latvian (Latviešu)</option>
										<option value="lt|lt_LT">Lithuanian (Lietuvių)</option>
										<option value="mk|mk_MK">Macedonian (Македонски)</option>
										<option value="ms|ms_MY">Malay (Bahasa Melayu)</option>
										<option value="ml|ml_IN">Malayalam (മലയാളം)</option>
										<option value="mt|mt">Maltese (Malti)</option>
										<option value="mr|mr">Marathi (मराठी)</option>
										<option value="mn|mn">Mongolian (Монгол)</option>
										<option value="no|nb_NO">Norwegian (Bokmål) (Norsk (bokmål))</option>
										<option value="ps|ps">Pashto (پښتو)</option>
										<option value="pl|pl_PL">Polish (Polski)</option>
										<option value="pt|pt_BR">Portuguese (Brazil) (Português (Brasil))</option>
										<option value="pt-PT|pt_PT">Portuguese (Portugal) (Português (Portugal))</option>
										<option value="pa|pa_IN">Punjabi (ਪੰਜਾਬੀ)</option>
										<option value="ro|ro_RO">Romanian (Română)</option>
										<option value="ru|ru_RU">Russian (Русский)</option>
										<option value="sr|sr_RS">Serbian (Српски)</option>
										<option value="si|si_LK">Sinhala (සිංහල)</option>
										<option value="sk|sk_SK">Slovak (Slovenčina)</option>
										<option value="sl|sl_SI">Slovenian (Slovenščina)</option>
										<option value="so|so_SO">Somali (Soomaali)</option>
										<option value="es|es_ES">Spanish (Español)</option>
										<option value="es-MX|es_MX">Spanish (Mexico) (Español (México))</option>
										<option value="sw|sw">Swahili (Kiswahili)</option>
										<option value="sv|sv_SE">Swedish (Svenska)</option>
										<option value="ta|ta_IN">Tamil (தமிழ்)</option>
										<option value="te|te">Telugu (తెలుగు)</option>
										<option value="th|th">Thai (ไทย)</option>
										<option value="tr|tr_TR">Turkish (Türkçe)</option>
										<option value="uk|uk">Ukrainian (Українська)</option>
										<option value="ur|ur">Urdu (اردو)</option>
										<option value="uz|uz_UZ">Uzbek (O'zbek)</option>
										<option value="vi|vi">Vietnamese (Tiếng Việt)</option>
										<option value="cy|cy">Welsh (Cymraeg)</option>
									</select>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- sidebar-header__bottom-section -->
			<div class="elm_ireLVL flex flex-column pt20 pb20 pl3 pr3">
				<!-- profile-container -->
				<div class="elm_JFpmSx flex">
					<!-- avatar-container -->
					<div class="elm_bDQBIO common_elm_luRCAg db w3 h3 bg-center cover br-100 relative pointer z-0" data-is-online="1" data-is-online-id=""
						style="background-image: url(https://fs.codelinden.com/wp-content/plugins/fansocial/assets/img/placeholder/placeholder-headshot-user.png);">
						<!-- online-dot -->
						<div class="elm_CYuIEk common_elm_jSurGj absolute dn">
							<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'livestream_dot', false, 'common_elm_JQXjfi'); ?>
						</div>
					</div>

					<!-- profile-info-container -->
					<div class="flex flex-column">
						<div class="flex items-center gap4">
							<h4 class="f5 fw6 lh-copy mb1 custom-text-primary-color truncate-text">Jenny</h4>
							<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'verified', false, 'common_elm_FSMoIG, w20, h20'); ?>
						</div>
						<span class="f7 mb2 dark-gray o-70">@whamiko</span>
						<!-- profile-stats-container -->
						<div class="flex items-center gap8">
							<div class="flex items-center gap4 o-70">
								<span class="f7 custom-text-secondary-color">1,230</span>
								<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'likes_filled', false, 'common_elm_qEZSJD, w1, h1'); ?>
							</div>
							<div class="flex items-center gap4 o-70">
								<span class="f7 custom-text-secondary-color">12K</span>
								<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'likes_filled', false, 'common_elm_qEZSJD, w1, h1'); ?>
							</div>
							<div class="flex items-center gap4 o-70">
								<span class="f7 custom-text-secondary-color">386</span>
								<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'logo_bg', false, 'common_elm_qEZSJD, w1, h1'); ?>
							</div>
						</div>
					</div>
				</div>

				<!-- toggle-btns-container -->
				<div class="flex flex-column gap8">
					<div class="flex justify-between items-center">
						<div class="flex items-center gap4">
							<span class="f6 lh-24 ttc custom-text-secondary-color">Private Chat</span>
							<span data-tooltip="If you don’t want to receive any video / audio calls, you can disable the service here">
								<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'question_circle', false, 'common_elm_qEZSJD, w1, h1'); ?>
							</span>
						</div>
						<div>
							<label class="switch">
								<input type="checkbox">
								<span class="slider round"></span>
							</label>
						</div>
					</div>
					<div class="flex justify-between items-center">
						<div class="flex items-center gap4">
							<span class="f6 lh-24 ttc custom-text-secondary-color">Video/Audio call</span>
							<span data-tooltip="If you don’t want to chat with fans right now, you can disable the service here">
								<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'question_circle', false, 'common_elm_qEZSJD, w1, h1'); ?>
							</span>
						</div>
						<div>
							<label class="switch">
								<input type="checkbox">
								<span class="slider round"></span>
							</label>
						</div>
					</div>
				</div>

				<!-- stream/profile-btn-container -->
				<div class="flex flex-column gap8">
					<button class="EMFHix EMFHix-alt">
						<span class="f6 fw5 lh-24 ttc custom-text-secondary-color">View profile</span>
					</button>
					<button class="EMFHix EMFHix-primary">
						<?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'streaming', false, 'common_elm_wPflhb, w20, h20'); ?>
						<span class="f6 fw5 lh-24 ttc custom-text-secondary-color">Start Streaming</span>
					</button>
				</div>
			</div>
		</div>

	</div>

</section>