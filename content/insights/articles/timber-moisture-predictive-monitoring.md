---
title: What Timber Moisture Data Can Tell Us About Building Health
# The heading above is the article. This is what a search result shows.
metaTitle: What Timber Moisture Data Says About a Building
date: 2026-05-22
author: Yuyang Peng
readTime: 4 min read
excerpt: >-
  A timber roof truss case study using dynamic regression and predictive analytics.
description: >-
  A timber roof truss case study on how continuous monitoring and a dynamic ARX
  model turn moisture data into earlier, better maintenance decisions.
image:
  src: /assets/img/cover-building-health.webp
  alt: Interior of a timber roof truss with a moisture data curve overlaid
  width: 1600
  height: 896
cardImage:
  src: /assets/img/news-building-health.webp
  alt: Interior of a timber roof truss with a moisture data curve overlaid
  width: 900
  height: 504
facts:
  - { label: Written by, value: Yuyang Peng }
  - { label: Category, value: Articles }
  - { label: Reading time, value: 4 min read }
  - { label: Method, value: Dynamic regression // ARX }
---

#### Most building defects do not begin with dramatic failures.

They often start as small and gradual changes that remain invisible for weeks or
even months. In timber structures, one of the most important of these changes is
moisture accumulation. Elevated moisture content can contribute to mould growth,
biological degradation, dimensional instability, and long-term durability issues.
By the time visible signs appear, deterioration may already be well underway.

Traditionally, building maintenance has relied heavily on periodic inspections and
visual assessments. While these methods remain important, they provide only
occasional snapshots of a building's condition. What happens between inspections is
often unknown.

With the increasing availability of sensors, continuous monitoring systems, and
predictive analytics, a different approach is becoming possible. Instead of waiting
for problems to appear, building operators can begin identifying hidden risks
through data and understanding how structural components behave over time.

This article presents a timber roof truss monitoring study that explored how
environmental data and dynamic modelling can be used to better understand timber
moisture behavior and support more proactive maintenance decisions.

![A Wiiste wood moisture sensor mounted on a timber surface](/assets/img/fig-timber-sensor.webp "Wood moisture sensor from Wiiste")

#### From Periodic Inspection to Continuous Monitoring

The study focused on a timber roof truss structure equipped with environmental and
material monitoring sensors. The objective was to continuously observe how timber
moisture content responds to changing climatic conditions within the roof space.

The monitoring system recorded several key variables, including timber moisture
content, attic relative humidity, and attic temperature. Over time, this produced a
detailed dataset describing both the surrounding environment and the timber's
response to it.

The benefit of this approach is straightforward. Instead of relying solely on
occasional inspections, building operators gain continuous visibility into how
environmental conditions influence structural materials throughout different
seasons and weather conditions.

However, collecting data is only the first step. The more important challenge is
understanding what that data means and whether it can help predict future
conditions.

##### Can we Predict Timber Moisture Behavior?

A logical starting point was to investigate whether timber moisture content could
be explained using current environmental conditions alone. A simple static
regression model was developed:

![The static regression model for timber moisture content](/assets/img/fig-timber-static-model.webp "The static model: moisture content as a function of current relative humidity and temperature")

In practical terms, this model assumes that timber responds immediately to the
surrounding environment. If relative humidity increases, timber moisture content
should increase accordingly. If humidity decreases, moisture content should
decrease as well.

This assumption appears reasonable at first. However, the monitoring results
suggested that reality is more complicated.

The static model confirmed that relative humidity was an important driver of timber
moisture behavior, but the overall explanatory power remained relatively limited.
The model achieved an R² value of approximately 0.24, indicating that a large
portion of the moisture variation could not be explained by current environmental
conditions alone.

This raised an important question: what information was missing?

#### Why the Static Model Was Not Enough?

The answer lies in the physical behavior of timber itself.

Unlike many mechanical systems, timber does not react instantly to environmental
changes. Moisture absorption and moisture release occur gradually. A period of high
humidity may continue influencing timber moisture levels long after environmental
conditions begin to change.

During the monitoring period, timber moisture content showed strong persistence
over time. The material's current condition was heavily influenced by its previous
moisture state rather than only by current environmental variables.

In simple terms, timber has memory. Its current condition depends not only on the
environment around it, but also on where it was several hours earlier. Once this
behavior became apparent, it was clear that a different modelling approach was
required.

#### Introducing the ARX model

To capture this delayed response, a dynamic ARX model was introduced. ARX stands
for autoregressive with exogenous inputs. Although the name sounds technical, the
concept is relatively straightforward. The model combines two sources of
information:

1. Current environmental conditions.
2. The timber's previous moisture state.

The simplified model can be expressed as:

![The ARX model, adding the previous moisture state as a term](/assets/img/fig-timber-arx-model.webp "The ARX model adds the previous moisture measurement as a term")

Rather than assuming timber reacts instantly to environmental changes, the ARX
model recognizes that moisture behavior develops over time. The previous state
contains valuable information about how the material is likely to behave next.

From an engineering perspective, this reflects a simple reality: timber has memory,
and predictive models should account for it.

Once the dynamic behavior of timber was incorporated into the model, prediction
performance improved significantly. The first-order ARX model already demonstrated
substantial improvements compared with the static approach. A second-order ARX
model provided an even closer representation of measured timber moisture behavior.

The resulting model achieved an R² value close to 0.999 while maintaining a very
low prediction error. More importantly, predicted values closely followed the
measurements recorded by the monitoring sensors.

![Observed versus predicted timber moisture content, with the residuals over time](/assets/img/fig-timber-arx-fit.webp "Figure 1: Observed vs Predicted Timber Moisture Content Using ARX Modelling")

The significance of this result extends beyond statistical performance. A model
that can reliably estimate expected moisture behavior provides a baseline for
normal operation. Future measurements can be compared against this baseline to
identify unusual patterns or emerging risks. Rather than waiting for visible signs
of deterioration, building operators gain the opportunity to investigate anomalies
at an earlier stage.

The transition is subtle but important. Maintenance shifts from reacting to
problems toward anticipating them.

#### What This Means for Building Maintenance?

The practical value of predictive monitoring is not the model itself. The value
lies in better decision-making.

Consider a situation in which moisture behavior begins deviating from expected
patterns following an extended period of rainfall. Without monitoring, the issue
may remain unnoticed until visible deterioration appears. With continuous
monitoring and predictive modelling, unusual behavior can be identified much
earlier, allowing maintenance teams to investigate before more significant damage
develops.

This approach does not replace engineering judgement or routine inspections.
Instead, it helps focus attention where it is needed most. Resources can be
allocated more effectively, inspections can become more targeted, and maintenance
planning can be informed by evidence rather than assumptions. For building owners
and facility managers, this represents a shift toward a more proactive and
data-driven maintenance strategy.

It also aligns closely with broader industry goals related to sustainability,
resilience, and lifecycle performance. Extending the service life of existing
structures is often more sustainable than replacing them, and predictive monitoring
offers one pathway toward achieving that objective.

#### Looking Ahead

While this study focused specifically on timber moisture behavior, the underlying
principle is applicable to many other building systems.

Continuous monitoring allows buildings to generate information about their own
condition. Predictive models help transform that information into actionable
insight.

Future building management systems may integrate monitoring platforms, predictive
analytics, and automated inspection technologies to support even earlier
identification of potential risks. However, the most important lesson from this
project is already clear today.

Buildings contain valuable information about their own health. The challenge is
learning how to listen. And that process begins with data.
