// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for SiteAnalyticsService.
 */

import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {SiteAnalyticsService} from 'services/site-analytics.service';
import {WindowRef} from 'services/contextual/window-ref.service';
import {LocalStorageService} from 'services/local-storage.service';
import {UserService} from 'services/user.service';
import {UserInfo} from 'domain/user/user-info.model';
import {NavbarAndFooterGATrackingPages} from 'app.constants';

describe('Site Analytics Service', () => {
  let sas: SiteAnalyticsService;
  let ws: WindowRef;
  let gtagSpy: jasmine.Spy;
  let pathname = 'pathname';
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const explorationId = 'abc1';

  class MockWindowRef {
    nativeWindow = {
      gtag: () => {},
      location: {
        pathname,
      },
    };
  }

  beforeEach(() => {
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getLastPageViewTime',
      'setLastPageViewTime',
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserInfoAsync',
    ]);
    userServiceSpy.getUserInfoAsync.and.resolveTo(UserInfo.createDefault());
    TestBed.configureTestingModule({
      providers: [
        SiteAnalyticsService,
        {
          provide: WindowRef,
          useClass: MockWindowRef,
        },
        {provide: LocalStorageService, useValue: localStorageServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
      ],
    }).compileComponents();

    sas = TestBed.inject(SiteAnalyticsService);
    ws = TestBed.inject(WindowRef);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should initialize google analytics', () => {
    expect(ws.nativeWindow.gtag).toBeDefined();
  });

  describe('when tested using gtag spy', () => {
    beforeEach(() => {
      gtagSpy = spyOn(ws.nativeWindow, 'gtag');
    });

    it('should register start login event', fakeAsync(() => {
      const element = 'LoginEventButton';
      sas.registerStartLoginEvent(element);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'login', {
        source_element: 'LoginEventButton',
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register new signup event', fakeAsync(() => {
      sas.registerNewSignupEvent('srcElement');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'sign_up', {
        source_element: 'srcElement',
        login_status: 'logged_out',
      });
    }));

    it('should register click browse lessons event', fakeAsync(() => {
      sas.registerClickBrowseLessonsButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'browse_lessons_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register click start learning button event', fakeAsync(() => {
      sas.registerClickStartLearningButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'start_learning_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register click start contributing button event', fakeAsync(() => {
      sas.registerClickStartContributingButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'start_contributing_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register go to donation site event', fakeAsync(() => {
      const donationSite = 'https://donation.com';
      sas.registerGoToDonationSiteEvent(donationSite);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'go_to_donation_site', {
        donation_site_name: donationSite,
        login_status: 'logged_out',
      });
    }));

    it('should register apply to teach with oppia event', fakeAsync(() => {
      sas.registerApplyToTeachWithOppiaEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'apply_to_teach_with_oppia',
        {
          login_status: 'logged_out',
        }
      );
    }));

    it('should register click create exploration button event', fakeAsync(() => {
      sas.registerClickCreateExplorationButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'create_exploration_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register create new exploration event', fakeAsync(() => {
      const explorationId = 'exp123';
      sas.registerCreateNewExplorationEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'create_new_exploration', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register create new exploration in collection event', fakeAsync(() => {
      const explorationId = 'exp123';
      sas.registerCreateNewExplorationInCollectionEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'create_new_exploration_in_collection',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register new collection event', fakeAsync(() => {
      const collectionId = 'abc1';
      sas.registerCreateNewCollectionEvent(collectionId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'create_new_collection', {
        collection_id: collectionId,
        login_status: 'logged_out',
      });
    }));

    it('should register commit changes to private exploration event', fakeAsync(() => {
      const explorationId = 'exp123';
      sas.registerCommitChangesToPrivateExplorationEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'commit_changes_to_private_exploration',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register share exploration event', fakeAsync(() => {
      const network = 'ShareExplorationNetwork';
      sas.registerShareExplorationEvent(network);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'share_exploration', {
        network: network,
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register share collection event', fakeAsync(() => {
      const network = 'ShareCollectionNetwork';
      sas.registerShareCollectionEvent(network);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'share_collection', {
        network: network,
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register share blog post event', fakeAsync(() => {
      const network = 'ShareBlogPostNetwork';
      sas.registerShareBlogPostEvent(network);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'share_blog_post', {
        network: network,
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register open embed info event', fakeAsync(() => {
      sas.registerOpenEmbedInfoEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'open_embed_info_modal', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register commit changes to public exploration event', fakeAsync(() => {
      sas.registerCommitChangesToPublicExplorationEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'commit_changes_to_public_exploration',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register tutorial modal open event', fakeAsync(() => {
      sas.registerTutorialModalOpenEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'tutorial_modal_open', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register decline tutorial modal event', fakeAsync(() => {
      sas.registerDeclineTutorialModalEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'decline_tutorial_modal', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register accept tutorial modal event', fakeAsync(() => {
      sas.registerAcceptTutorialModalEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'accept_tutorial_modal', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register click help button event', fakeAsync(() => {
      sas.registerClickHelpButtonEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'click_help_button', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register visit help center event', fakeAsync(() => {
      sas.registerVisitHelpCenterEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'visit_help_center', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register open tutorial from help center event', fakeAsync(() => {
      sas.registerOpenTutorialFromHelpCenterEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'open_tutorial_from_help_center',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register skip tutorial event', fakeAsync(() => {
      sas.registerSkipTutorialEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'skip_tutorial', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register finish tutorial event', fakeAsync(() => {
      sas.registerFinishTutorialEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'finish_tutorial', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register editor first entry event', fakeAsync(() => {
      sas.registerEditorFirstEntryEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'editor_first_entry', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register first open content box event', fakeAsync(() => {
      sas.registerFirstOpenContentBoxEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'first_open_content_box', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register first save content event', fakeAsync(() => {
      sas.registerFirstSaveContentEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'first_save_content', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register first click add interaction event', fakeAsync(() => {
      sas.registerFirstClickAddInteractionEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'first_click_add_interaction',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register select interaction type event', fakeAsync(() => {
      sas.registerFirstSelectInteractionTypeEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'first_select_interaction_type',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register first save interaction event', fakeAsync(() => {
      sas.registerFirstSaveInteractionEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'first_save_interaction', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register first save rule event', fakeAsync(() => {
      sas.registerFirstSaveRuleEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'first_save_rule', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register first create second state event', fakeAsync(() => {
      sas.registerFirstCreateSecondStateEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'first_create_second_state',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register save playable exploration event', fakeAsync(() => {
      sas.registerSavePlayableExplorationEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'save_playable_exploration',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register open publish exploration modal event', fakeAsync(() => {
      sas.registerOpenPublishExplorationModalEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'open_publish_exploration_modal',
        {
          exploration_id: explorationId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register publish exploration event', fakeAsync(() => {
      sas.registerPublishExplorationEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'publish_exploration', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register visit oppia from iframe event', fakeAsync(() => {
      sas.registerVisitOppiaFromIframeEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'visit_oppia_from_iframe', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register new card when card number is less than 10', fakeAsync(() => {
      const cardNumber = 1;
      sas.registerNewCard(cardNumber, 'abc1');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'new_card_load', {
        exploration_id: 'abc1',
        card_number: cardNumber,
        login_status: 'logged_out',
      });
    }));

    it(
      'should register new card when card number is greather than 10 and' +
        " it's a multiple of 10",
      fakeAsync(() => {
        const cardNumber = 20;
        sas.registerNewCard(cardNumber, 'abc1');
        tick();

        expect(gtagSpy).toHaveBeenCalledWith('event', 'new_card_load', {
          exploration_id: 'abc1',
          card_number: cardNumber,
          login_status: 'logged_out',
        });
      })
    );

    it('should not register new card', fakeAsync(() => {
      const cardNumber = 35;
      sas.registerNewCard(cardNumber, 'abc1');
      tick();

      expect(gtagSpy).not.toHaveBeenCalled();
    }));

    it('should register finish exploration event', fakeAsync(() => {
      sas.registerFinishExploration('123');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'lesson_completed', {
        exploration_id: '123',
        login_status: 'logged_out',
      });
    }));

    it('should register finish curated lesson event', fakeAsync(() => {
      sas.registerCuratedLessonStarted('Fractions', '123');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'classroom_lesson_started',
        {
          topic_name: 'Fractions',
          exploration_id: '123',
          login_status: 'logged_out',
        }
      );
    }));

    it('should register finish curated lesson event', fakeAsync(() => {
      sas.registerCuratedLessonCompleted(
        'math',
        'Fractions',
        'ch1',
        '123',
        '2',
        '3',
        'en'
      );
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'classroom_lesson_completed',
        {
          classroom_name: 'math',
          topic_name: 'Fractions',
          chapter_name: 'ch1',
          exploration_id: '123',
          chapter_number: '2',
          chapter_card_count: '3',
          exploration_language: 'en',
          login_status: 'logged_out',
        }
      );
    }));

    it('should register open collection from landing page event', fakeAsync(() => {
      const collectionId = 'abc1';
      sas.registerOpenCollectionFromLandingPageEvent(collectionId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'open_fractions_from_landing_page',
        {
          collection_id: collectionId,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register save recorded audio event', fakeAsync(() => {
      sas.registerSaveRecordedAudioEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'save_recorded_audio', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register audio recording event', fakeAsync(() => {
      sas.registerStartAudioRecordingEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'start_audio_recording', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register upload audio event', fakeAsync(() => {
      sas.registerUploadAudioEvent(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'upload_recorded_audio', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register Contributor Dashboard suggest event', fakeAsync(() => {
      const contributionType = 'Translation';
      sas.registerContributorDashboardSuggestEvent(contributionType);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'contributor_dashboard_suggest',
        {
          contribution_type: contributionType,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Contributor Dashboard submit suggestion event', fakeAsync(() => {
      const contributionType = 'Translation';
      sas.registerContributorDashboardSubmitSuggestionEvent(contributionType);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'contributor_dashboard_submit_suggestion',
        {
          contribution_type: contributionType,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Contributor Dashboard view suggestion for review event', fakeAsync(() => {
      const contributionType = 'Translation';
      sas.registerContributorDashboardViewSuggestionForReview(contributionType);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'contributor_dashboard_view_suggestion_for_review',
        {
          contribution_type: contributionType,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Contributor Dashboard accept suggestion event', fakeAsync(() => {
      const contributionType = 'Translation';
      sas.registerContributorDashboardAcceptSuggestion(contributionType);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'contributor_dashboard_accept_suggestion',
        {
          contribution_type: contributionType,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Contributor Dashboard reject suggestion event', fakeAsync(() => {
      const contributionType = 'Translation';
      sas.registerContributorDashboardRejectSuggestion(contributionType);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'contributor_dashboard_reject_suggestion',
        {
          contribution_type: contributionType,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register active lesson usage', fakeAsync(() => {
      sas.registerLessonActiveUse();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'active_user_start_and_saw_cards',
        {
          login_status: 'logged_out',
        }
      );
    }));

    it('should register exploration start', fakeAsync(() => {
      sas.registerStartExploration(explorationId);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'lesson_started', {
        exploration_id: explorationId,
        login_status: 'logged_out',
      });
    }));

    it('should register classroom page viewed', fakeAsync(() => {
      spyOn(sas, '_sendEventToGoogleAnalytics');

      sas.registerClassroomPageViewed();
      tick();
      expect(sas._sendEventToGoogleAnalytics).toHaveBeenCalledWith(
        'view_classroom',
        {}
      );
    }));

    it('should register active classroom lesson usage', fakeAsync(() => {
      let explorationId = '123';
      sas.registerClassroomLessonEngagedWithEvent(
        'math',
        'Fractions',
        'ch1',
        explorationId,
        '2',
        '3',
        'en'
      );
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'classroom_lesson_engaged_with',
        {
          classroom_name: 'math',
          topic_name: 'Fractions',
          chapter_name: 'ch1',
          exploration_id: '123',
          chapter_number: '2',
          chapter_card_count: '3',
          exploration_language: 'en',
          login_status: 'logged_out',
        }
      );
    }));

    it('should register community lesson completed event', fakeAsync(() => {
      sas.registerCommunityLessonCompleted('exp_id');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'community_lesson_completed',
        {
          exploration_id: 'exp_id',
          login_status: 'logged_out',
        }
      );
    }));

    it('should register community lesson started event', fakeAsync(() => {
      sas.registerCommunityLessonStarted('exp_id');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'community_lesson_started',
        {
          exploration_id: 'exp_id',
          login_status: 'logged_out',
        }
      );
    }));

    it('should register audio play event', fakeAsync(() => {
      sas.registerStartAudioPlayedEvent('exp_id', 0);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'audio_played', {
        exploration_id: 'exp_id',
        card_number: 0,
        login_status: 'logged_out',
      });
    }));

    it('should register practice session start event', fakeAsync(() => {
      sas.registerPracticeSessionStartEvent('math', 'topic', '1,2,3');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'practice_session_start', {
        classroom_name: 'math',
        topic_name: 'topic',
        practice_session_id: '1,2,3',
        login_status: 'logged_out',
      });
    }));

    it('should register practice session end event', fakeAsync(() => {
      sas.registerPracticeSessionEndEvent('math', 'topic', '1,2,3', 10, 10);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'practice_session_complete',
        {
          classroom_name: 'math',
          topic_name: 'topic',
          practice_session_id: '1,2,3',
          questions_answered: 10,
          total_score: 10,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register search results viewed event', fakeAsync(() => {
      sas.registerSearchResultsViewedEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'view_search_results', {
        login_status: 'logged_out',
      });
    }));

    it('should register homepage start learning button click event', fakeAsync(() => {
      sas.registerClickHomePageStartLearningButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'discovery_start_learning',
        {
          login_status: 'logged_out',
        }
      );
    }));

    it('should register submitted answer', fakeAsync(() => {
      const answerIsCorrect = true;
      sas.registerAnswerSubmitted(explorationId, answerIsCorrect);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'answer_submitted', {
        exploration_id: explorationId,
        answer_is_correct: answerIsCorrect,
        login_status: 'logged_out',
      });
    }));

    it('should register Volunteer CTA button click event', fakeAsync(() => {
      const srcElement = 'Volunteer with Oppia';
      sas.registerClickVolunteerCTAButtonEvent(srcElement);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'volunteer_cta_button_click',
        {
          page_path: pathname,
          source_element: srcElement,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Partner CTA button click event', fakeAsync(() => {
      const srcElement = 'Partner with us at the top of the page';
      sas.registerClickPartnerCTAButtonEvent(srcElement);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'partner_cta_button_click',
        {
          page_path: pathname,
          source_element: srcElement,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Donate CTA button click event', fakeAsync(() => {
      sas.registerClickDonateCTAButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'donate_cta_button_click', {
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register Get the Android App button click event', fakeAsync(() => {
      sas.registerClickGetAndroidAppButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'get_android_app_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Volunteer Learn more button click event', fakeAsync(() => {
      sas.registerClickLearnMoreVolunteerButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'learn_more_volunteer_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register Partner Learn more button click event', fakeAsync(() => {
      sas.registerClickLearnMorePartnerButtonEvent();
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'learn_more_partner_button_click',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register navbar button click event', fakeAsync(() => {
      const buttonName = NavbarAndFooterGATrackingPages.ABOUT;
      sas.registerClickNavbarButtonEvent(buttonName);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'navbar_button_click', {
        button_name: buttonName,
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register footer button click event', fakeAsync(() => {
      const buttonName = NavbarAndFooterGATrackingPages.ABOUT;
      sas.registerClickFooterButtonEvent(buttonName);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'footer_button_click', {
        button_name: buttonName,
        page_path: pathname,
        login_status: 'logged_out',
      });
    }));

    it('should register first time page view event', fakeAsync(() => {
      localStorageService.getLastPageViewTime.and.returnValue(
        new Date().getTime() - 10000000000
      );
      sas.registerFirstTimePageViewEvent('key');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'first_time_page_view_in_month',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'first_time_page_view_in_week',
        {
          page_path: pathname,
          login_status: 'logged_out',
        }
      );
    }));

    it('should not send any event if time difference is less than one week', fakeAsync(() => {
      const sixDaysInMillis = 6 * 24 * 60 * 60 * 1000;
      const lastPageViewTime = new Date().getTime() - sixDaysInMillis;
      localStorageService.getLastPageViewTime.and.returnValue(lastPageViewTime);
      const testKey = 'testKey';
      sas.registerFirstTimePageViewEvent(testKey);
      tick();

      expect(gtagSpy).not.toHaveBeenCalled();
      expect(localStorageService.setLastPageViewTime).toHaveBeenCalledWith(
        testKey
      );
    }));

    it('should set last page view time if lastPageViewTime is null', fakeAsync(() => {
      localStorageService.getLastPageViewTime.and.returnValue(null);
      const testKey = 'testKey';
      sas.registerFirstTimePageViewEvent(testKey);
      tick();

      expect(gtagSpy).not.toHaveBeenCalled();
      expect(localStorageService.setLastPageViewTime).toHaveBeenCalledWith(
        testKey
      );
    }));

    it('should register classroom card click event', fakeAsync(() => {
      const srcElement = 'Math';
      const classroomName = 'Math';
      sas.registerClickClassroomCardEvent(srcElement, classroomName);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'classroom_card_click', {
        page_path: pathname,
        source_element: srcElement,
        classroom_name: classroomName,
        login_status: 'logged_out',
      });
    }));

    it('should register new classroom lesson engaged with event', fakeAsync(() => {
      const classroomName = 'Math';
      const topicName = 'Fractions';
      sas.registerNewClassroomLessonEngagedWithEvent(classroomName, topicName);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'new_classroom_lesson_engaged_with',
        {
          classroom_name: classroomName,
          topic_name: topicName,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register in-progress classroom lesson card click event', fakeAsync(() => {
      sas.registerInProgressClassroomLessonEngagedWithEvent('Math', 'Addition');
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'classroom_lesson_in_progress_engaged_with',
        {
          classroom_name: 'Math',
          topic_name: 'Addition',
          login_status: 'logged_out',
        }
      );
    }));

    it('should register diagnostic test completion event', fakeAsync(() => {
      const classroomName = 'Math';
      sas.registerDiagnosticTestCompletionEvent(classroomName);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'diagnostic_test_completion',
        {
          classroom_name: classroomName,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register classroom lesson in progress engaged with event', fakeAsync(() => {
      const classroomName = 'Math';
      const topicName = 'Fractions';
      sas.registerInProgressClassroomLessonEngagedWithEvent(
        classroomName,
        topicName
      );
      tick();

      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'classroom_lesson_in_progress_engaged_with',
        {
          classroom_name: classroomName,
          topic_name: topicName,
          login_status: 'logged_out',
        }
      );
    }));

    it('should register diagnostic test started event', fakeAsync(() => {
      const classroomName = 'Math';
      sas.registerDiagnosticTestStartedEvent(classroomName);
      tick();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'diagnostic_test_started', {
        classroom_name: classroomName,
        login_status: 'logged_out',
      });
    }));
  });
});
